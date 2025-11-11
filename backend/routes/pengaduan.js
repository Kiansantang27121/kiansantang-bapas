import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all pengaduan
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, priority, date } = req.query;
    let query = 'SELECT * FROM pengaduan WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (date) {
      query += ' AND DATE(created_at) = DATE(?)';
      params.push(date);
    } else {
      query += ' AND DATE(created_at) = DATE("now", "localtime")';
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    const pengaduan = db.prepare(query).all(...params);
    res.json(pengaduan);
  } catch (error) {
    console.error('Error fetching pengaduan:', error);
    res.status(500).json({ error: 'Failed to fetch pengaduan' });
  }
});

// Create new pengaduan (public - no auth required)
router.post('/submit', (req, res) => {
  try {
    const {
      complainant_name,
      complainant_nik,
      complainant_phone,
      complainant_email,
      complaint_type,
      complaint_subject,
      complaint_description,
      priority
    } = req.body;

    if (!complainant_name || !complaint_subject || !complaint_description) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate queue number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = db.prepare(
      'SELECT COUNT(*) as count FROM pengaduan WHERE DATE(created_at) = DATE("now", "localtime")'
    ).get().count;
    const queueNumber = `PG${today}${String(count + 1).padStart(3, '0')}`;

    const result = db.prepare(`
      INSERT INTO pengaduan (
        queue_number, complainant_name, complainant_nik, complainant_phone,
        complainant_email, complaint_type, complaint_subject, complaint_description,
        priority, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')
    `).run(
      queueNumber, complainant_name, complainant_nik || null,
      complainant_phone || null, complainant_email || null,
      complaint_type || 'umum', complaint_subject, complaint_description,
      priority || 'normal'
    );

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Pengaduan berhasil dikirim',
      queue_number: queueNumber,
      pengaduan
    });
  } catch (error) {
    console.error('Error creating pengaduan:', error);
    res.status(500).json({ error: 'Failed to create pengaduan' });
  }
});

// Create pengaduan (authenticated)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      complainant_name,
      complainant_nik,
      complainant_phone,
      complainant_email,
      complaint_type,
      complaint_subject,
      complaint_description,
      priority
    } = req.body;

    if (!complainant_name || !complaint_subject || !complaint_description) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate queue number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = db.prepare(
      'SELECT COUNT(*) as count FROM pengaduan WHERE DATE(created_at) = DATE("now", "localtime")'
    ).get().count;
    const queueNumber = `PG${today}${String(count + 1).padStart(3, '0')}`;

    const result = db.prepare(`
      INSERT INTO pengaduan (
        queue_number, complainant_name, complainant_nik, complainant_phone,
        complainant_email, complaint_type, complaint_subject, complaint_description,
        priority, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')
    `).run(
      queueNumber, complainant_name, complainant_nik || null,
      complainant_phone || null, complainant_email || null,
      complaint_type || 'umum', complaint_subject, complaint_description,
      priority || 'normal'
    );

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(result.lastInsertRowid);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('pengaduan:new', pengaduan);

    res.status(201).json(pengaduan);
  } catch (error) {
    console.error('Error creating pengaduan:', error);
    res.status(500).json({ error: 'Failed to create pengaduan' });
  }
});

// Assign to petugas
router.post('/:id/assign', authenticateToken, (req, res) => {
  try {
    const { petugas_id } = req.body;
    
    db.prepare('UPDATE pengaduan SET assigned_to_petugas_id = ? WHERE id = ?')
      .run(petugas_id, req.params.id);

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('pengaduan:assigned', pengaduan);

    res.json(pengaduan);
  } catch (error) {
    console.error('Error assigning pengaduan:', error);
    res.status(500).json({ error: 'Failed to assign pengaduan' });
  }
});

// Accept pengaduan (by petugas)
router.post('/:id/accept', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE pengaduan 
      SET status = 'serving', accepted_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(req.params.id);

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('pengaduan:accepted', pengaduan);

    res.json(pengaduan);
  } catch (error) {
    console.error('Error accepting pengaduan:', error);
    res.status(500).json({ error: 'Failed to accept pengaduan' });
  }
});

// Complete pengaduan
router.post('/:id/complete', authenticateToken, (req, res) => {
  try {
    const { resolution, notes } = req.body;

    if (!resolution) {
      return res.status(400).json({ error: 'Resolution required' });
    }

    db.prepare(`
      UPDATE pengaduan 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, 
          resolution = ?, notes = ?
      WHERE id = ?
    `).run(resolution, notes || null, req.params.id);

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('pengaduan:completed', pengaduan);

    res.json(pengaduan);
  } catch (error) {
    console.error('Error completing pengaduan:', error);
    res.status(500).json({ error: 'Failed to complete pengaduan' });
  }
});

// Escalate pengaduan
router.post('/:id/escalate', authenticateToken, (req, res) => {
  try {
    const { notes } = req.body;

    db.prepare(`
      UPDATE pengaduan 
      SET status = 'escalated', priority = 'urgent', notes = ?
      WHERE id = ?
    `).run(notes || 'Pengaduan dieskalasi', req.params.id);

    const pengaduan = db.prepare('SELECT * FROM pengaduan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('pengaduan:escalated', pengaduan);

    res.json(pengaduan);
  } catch (error) {
    console.error('Error escalating pengaduan:', error);
    res.status(500).json({ error: 'Failed to escalate pengaduan' });
  }
});

// Get my pengaduan (for petugas)
router.get('/my-tasks', authenticateToken, (req, res) => {
  try {
    const pengaduan = db.prepare(`
      SELECT * FROM pengaduan 
      WHERE assigned_to_petugas_id = ? 
        AND status IN ('waiting', 'serving')
      ORDER BY priority DESC, created_at ASC
    `).all(req.user.id);

    res.json(pengaduan);
  } catch (error) {
    console.error('Error fetching my pengaduan:', error);
    res.status(500).json({ error: 'Failed to fetch pengaduan' });
  }
});

// Check pengaduan status (public)
router.get('/check/:queueNumber', (req, res) => {
  try {
    const pengaduan = db.prepare(`
      SELECT queue_number, complaint_subject, status, priority, 
             resolution, created_at, completed_at
      FROM pengaduan 
      WHERE queue_number = ?
    `).get(req.params.queueNumber);

    if (!pengaduan) {
      return res.status(404).json({ error: 'Pengaduan not found' });
    }

    res.json(pengaduan);
  } catch (error) {
    console.error('Error checking pengaduan:', error);
    res.status(500).json({ error: 'Failed to check pengaduan' });
  }
});

export default router;
