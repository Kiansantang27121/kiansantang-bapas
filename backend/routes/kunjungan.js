import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all kunjungan
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, date } = req.query;
    let query = 'SELECT * FROM kunjungan WHERE 1=1';
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

    const kunjungan = db.prepare(query).all(...params);
    res.json(kunjungan);
  } catch (error) {
    console.error('Error fetching kunjungan:', error);
    res.status(500).json({ error: 'Failed to fetch kunjungan' });
  }
});

// Create new kunjungan
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      visitor_name,
      visitor_nik,
      visitor_phone,
      visitor_relation,
      client_name,
      client_id,
      visit_purpose
    } = req.body;

    if (!visitor_name || !client_name) {
      return res.status(400).json({ error: 'Visitor name and client name required' });
    }

    // Generate queue number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = db.prepare(
      'SELECT COUNT(*) as count FROM kunjungan WHERE DATE(created_at) = DATE("now", "localtime")'
    ).get().count;
    const queueNumber = `KJ${today}${String(count + 1).padStart(3, '0')}`;

    const result = db.prepare(`
      INSERT INTO kunjungan (
        queue_number, visitor_name, visitor_nik, visitor_phone, visitor_relation,
        client_name, client_id, visit_purpose, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'waiting')
    `).run(
      queueNumber, visitor_name, visitor_nik || null, visitor_phone || null,
      visitor_relation || null, client_name, client_id || null, visit_purpose || null
    );

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(result.lastInsertRowid);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('kunjungan:new', kunjungan);

    res.status(201).json(kunjungan);
  } catch (error) {
    console.error('Error creating kunjungan:', error);
    res.status(500).json({ error: 'Failed to create kunjungan' });
  }
});

// Assign to petugas
router.post('/:id/assign', authenticateToken, (req, res) => {
  try {
    const { petugas_id } = req.body;
    
    db.prepare('UPDATE kunjungan SET assigned_to_petugas_id = ? WHERE id = ?')
      .run(petugas_id, req.params.id);

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('kunjungan:assigned', kunjungan);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error assigning kunjungan:', error);
    res.status(500).json({ error: 'Failed to assign kunjungan' });
  }
});

// Accept kunjungan (by petugas)
router.post('/:id/accept', authenticateToken, (req, res) => {
  try {
    db.prepare(`
      UPDATE kunjungan 
      SET status = 'called', accepted_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(req.params.id);

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('kunjungan:called', kunjungan);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error accepting kunjungan:', error);
    res.status(500).json({ error: 'Failed to accept kunjungan' });
  }
});

// Start serving
router.post('/:id/serve', authenticateToken, (req, res) => {
  try {
    db.prepare('UPDATE kunjungan SET status = "serving" WHERE id = ?').run(req.params.id);

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('kunjungan:serving', kunjungan);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error serving kunjungan:', error);
    res.status(500).json({ error: 'Failed to serve kunjungan' });
  }
});

// Complete kunjungan
router.post('/:id/complete', authenticateToken, (req, res) => {
  try {
    const { notes } = req.body;

    db.prepare(`
      UPDATE kunjungan 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, notes = ?
      WHERE id = ?
    `).run(notes || null, req.params.id);

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('kunjungan:completed', kunjungan);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error completing kunjungan:', error);
    res.status(500).json({ error: 'Failed to complete kunjungan' });
  }
});

// Reject kunjungan
router.post('/:id/reject', authenticateToken, (req, res) => {
  try {
    const { notes } = req.body;

    db.prepare(`
      UPDATE kunjungan 
      SET status = 'rejected', notes = ?
      WHERE id = ?
    `).run(notes || 'Kunjungan ditolak', req.params.id);

    const kunjungan = db.prepare('SELECT * FROM kunjungan WHERE id = ?').get(req.params.id);
    
    const io = req.app.get('io');
    io.emit('kunjungan:rejected', kunjungan);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error rejecting kunjungan:', error);
    res.status(500).json({ error: 'Failed to reject kunjungan' });
  }
});

// Get my kunjungan (for petugas)
router.get('/my-tasks', authenticateToken, (req, res) => {
  try {
    const kunjungan = db.prepare(`
      SELECT * FROM kunjungan 
      WHERE assigned_to_petugas_id = ? 
        AND status IN ('waiting', 'called', 'serving')
      ORDER BY created_at ASC
    `).all(req.user.id);

    res.json(kunjungan);
  } catch (error) {
    console.error('Error fetching my kunjungan:', error);
    res.status(500).json({ error: 'Failed to fetch kunjungan' });
  }
});

export default router;
