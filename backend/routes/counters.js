import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all counters
router.get('/', (req, res) => {
  try {
    const counters = db.prepare(`
      SELECT c.*, u.name as operator_name, u.username as operator_username
      FROM counters c
      LEFT JOIN users u ON c.operator_id = u.id
      ORDER BY c.counter_number
    `).all();
    res.json(counters);
  } catch (error) {
    console.error('Get counters error:', error);
    res.status(500).json({ error: 'Failed to fetch counters' });
  }
});

// Get counter by ID
router.get('/:id', (req, res) => {
  try {
    const counter = db.prepare(`
      SELECT c.*, u.name as operator_name, u.username as operator_username
      FROM counters c
      LEFT JOIN users u ON c.operator_id = u.id
      WHERE c.id = ?
    `).get(req.params.id);

    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    res.json(counter);
  } catch (error) {
    console.error('Get counter error:', error);
    res.status(500).json({ error: 'Failed to fetch counter' });
  }
});

// Create counter (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { counter_number, name } = req.body;

    if (!counter_number || !name) {
      return res.status(400).json({ error: 'Counter number and name required' });
    }

    const result = db.prepare(
      'INSERT INTO counters (counter_number, name) VALUES (?, ?)'
    ).run(counter_number, name);

    const counter = db.prepare('SELECT * FROM counters WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(counter);
  } catch (error) {
    console.error('Create counter error:', error);
    res.status(500).json({ error: 'Failed to create counter' });
  }
});

// Update counter (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { counter_number, name, is_active, operator_id } = req.body;

    const counter = db.prepare('SELECT * FROM counters WHERE id = ?').get(req.params.id);
    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    db.prepare(
      'UPDATE counters SET counter_number = ?, name = ?, is_active = ?, operator_id = ? WHERE id = ?'
    ).run(
      counter_number !== undefined ? counter_number : counter.counter_number,
      name || counter.name,
      is_active !== undefined ? is_active : counter.is_active,
      operator_id !== undefined ? operator_id : counter.operator_id,
      req.params.id
    );

    const updated = db.prepare(`
      SELECT c.*, u.name as operator_name, u.username as operator_username
      FROM counters c
      LEFT JOIN users u ON c.operator_id = u.id
      WHERE c.id = ?
    `).get(req.params.id);

    res.json(updated);
  } catch (error) {
    console.error('Update counter error:', error);
    res.status(500).json({ error: 'Failed to update counter' });
  }
});

// Delete counter (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const counter = db.prepare('SELECT * FROM counters WHERE id = ?').get(req.params.id);
    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    db.prepare('DELETE FROM counters WHERE id = ?').run(req.params.id);
    res.json({ message: 'Counter deleted successfully' });
  } catch (error) {
    console.error('Delete counter error:', error);
    res.status(500).json({ error: 'Failed to delete counter' });
  }
});

export default router;
