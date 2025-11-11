import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const today = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status = 'serving' THEN 1 ELSE 0 END) as serving,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM queue 
      WHERE DATE(created_at) = CURRENT_DATE
    `).get();

    const byService = db.prepare(`
      SELECT s.name, COUNT(q.id) as count
      FROM services s
      LEFT JOIN queue q ON s.id = q.service_id AND DATE(q.created_at) = CURRENT_DATE
      WHERE s.is_active = 1
      GROUP BY s.id, s.name
    `).all();

    res.json({ today, byService });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
