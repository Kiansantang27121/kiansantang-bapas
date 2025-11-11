import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all services (public)
router.get('/', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY name').all();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get all services including inactive (admin only)
router.get('/all', authenticateToken, requireAdmin, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY name').all();
    res.json(services);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, estimated_time } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Service name required' });
    }

    const result = db.prepare(
      'INSERT INTO services (name, description, estimated_time) VALUES (?, ?, ?)'
    ).run(name, description, estimated_time || 30);

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, estimated_time, is_active } = req.body;

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    db.prepare(
      'UPDATE services SET name = ?, description = ?, estimated_time = ?, is_active = ? WHERE id = ?'
    ).run(
      name || service.name,
      description !== undefined ? description : service.description,
      estimated_time || service.estimated_time,
      is_active !== undefined ? is_active : service.is_active,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
