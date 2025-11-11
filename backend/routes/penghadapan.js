import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all penghadapan
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, date } = req.query;
    let query = 'SELECT * FROM penghadapan WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(created_at) = DATE(?)';
      params.push(date);
    } else {
      query += ' AND DATE(created_at) = DATE("now", "localtime")';
    }

    query += ' ORDER BY created_at DESC';

    const penghadapan = db.prepare(query).all(...params);
    res.json(penghadapan);
  } catch (error) {
    console.error('Error fetching penghadapan:', error);
    res.status(500).json({ error: 'Failed to fetch penghadapan' });
  }
});

// Create new penghadapan
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      client_name,
      client_nik,
      client_phone,
      client_id,
      court_name,
      hearing_date,
      hearing_time,
      case_number
    } = req.body;

    if (!client_name || !court_name || !hearing_date) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Generate queue number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = db.prepare(
      'SELECT COUNT(*) as count FROM penghadapan WHERE DATE(created_at) = DATE("now", "localtime")'
    ).get().count;
    const queueNumber = `PH${today}${String(count + 1).padStart(3, '0')}`;

    const result = db.prepare(`
      INSERT INTO penghadapan (
        queue_number, client_name, client_nik, client_phone, client_id,
        court_name, hearing_date, hearing_time, case_number, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting')
    `).run(
      queueNumber, client_name, client_nik || null, client_phone || null,
      client_id || null, court_name, hearing_date, hearing_time || null,
      case_number || null
    );

    const penghadapan = db.prepare('SELECT * FROM penghadapan WHERE id = ?').get(result.lastInsertRowid);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('penghadapan:new', penghadapan);

    res.status(201).json(penghadapan);
  } catch (error) {
    console.error('Error creating penghadapan:', error);
    res.status(500).json({ error: 'Failed to create penghadapan' });
  }
});

// Assign to petugas
router.post('/:id/assign', authenticateToken, (req, res) => {
  try {
    const { petugas_id } = req.body;
    
    db.prepare('UPDATE penghadapan SET assigned_to_petugas_id = ? WHERE id = ?')
      .run(petugas_id, req.params.id);

    const penghadapan = db.prepare('SELECT * FROM penghadapan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('penghadapan:assigned', penghadapan);

    res.json(penghadapan);
  } catch (error) {
    console.error('Error assigning penghadapan:', error);
    res.status(500).json({ error: 'Failed to assign penghadapan' });
  }
});

// Accept penghadapan (by petugas)
router.post('/:id/accept', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE penghadapan 
      SET status = 'called', accepted_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(req.params.id);

    const penghadapan = db.prepare('SELECT * FROM penghadapan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('penghadapan:called', penghadapan);

    res.json(penghadapan);
  } catch (error) {
    console.error('Error accepting penghadapan:', error);
    res.status(500).json({ error: 'Failed to accept penghadapan' });
  }
});

// Complete penghadapan
router.post('/:id/complete', authenticateToken, (req, res) => {
  try {
    const { notes } = req.body;

    db.prepare(`
      UPDATE penghadapan 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `).run(notes || null, req.params.id);

    const penghadapan = db.prepare('SELECT * FROM penghadapan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('penghadapan:completed', penghadapan);

    res.json(penghadapan);
  } catch (error) {
    console.error('Error completing penghadapan:', error);
    res.status(500).json({ error: 'Failed to complete penghadapan' });
  }
});

// Get my penghadapan (for petugas)
router.get('/my-tasks', authenticateToken, (req, res) => {
  try {
    const penghadapan = db.prepare(`
      SELECT * FROM penghadapan 
      WHERE assigned_to_petugas_id = ? 
        AND status IN ('waiting', 'called', 'serving')
      ORDER BY created_at ASC
    `).all(req.user.id);

    res.json(penghadapan);
  } catch (error) {
    console.error('Error fetching my penghadapan:', error);
    res.status(500).json({ error: 'Failed to fetch penghadapan' });
  }
});

export default router;
