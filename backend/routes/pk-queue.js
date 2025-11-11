import express from 'express';
import db from '../database.js';
import { authenticateToken, requirePK } from '../middleware/auth.js';

const router = express.Router();

// Get queues assigned to this PK
router.get('/my-queues', authenticateToken, requirePK, (req, res) => {
  try {
    const pkId = req.user.pk_id;

    const queues = db.prepare(`
      SELECT q.*, 
             s.name as service_name,
             s.estimated_time,
             p.name as pk_name,
             c.name as client_full_name,
             c.phone as client_full_phone,
             c.address as client_address
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.assigned_to_pk_id = ?
        AND q.status IN ('waiting', 'called', 'serving')
      ORDER BY q.created_at ASC
    `).all(pkId);

    res.json(queues);
  } catch (error) {
    console.error('Error fetching PK queues:', error);
    res.status(500).json({ error: 'Failed to fetch queues' });
  }
});

// Get queue statistics for this PK
router.get('/statistics', authenticateToken, requirePK, (req, res) => {
  try {
    const pkId = req.user.pk_id;
    const today = new Date().toISOString().split('T')[0];

    const stats = {
      today: {
        waiting: db.prepare(`
          SELECT COUNT(*) as count FROM queue 
          WHERE assigned_to_pk_id = ? 
            AND DATE(created_at) = ? 
            AND status = 'waiting'
        `).get(pkId, today).count,
        
        serving: db.prepare(`
          SELECT COUNT(*) as count FROM queue 
          WHERE assigned_to_pk_id = ? 
            AND DATE(created_at) = ? 
            AND status = 'serving'
        `).get(pkId, today).count,
        
        completed: db.prepare(`
          SELECT COUNT(*) as count FROM queue 
          WHERE assigned_to_pk_id = ? 
            AND DATE(created_at) = ? 
            AND status = 'completed'
        `).get(pkId, today).count,
        
        total: db.prepare(`
          SELECT COUNT(*) as count FROM queue 
          WHERE assigned_to_pk_id = ? 
            AND DATE(created_at) = ?
        `).get(pkId, today).count
      },
      
      avgRating: db.prepare(`
        SELECT AVG(rating) as avg FROM queue 
        WHERE assigned_to_pk_id = ? 
          AND rating IS NOT NULL
      `).get(pkId).avg || 0,
      
      totalServed: db.prepare(`
        SELECT COUNT(*) as count FROM queue 
        WHERE assigned_to_pk_id = ? 
          AND status = 'completed'
      `).get(pkId).count
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Accept queue (PK menerima antrian dari operator)
router.post('/:queueId/accept', authenticateToken, requirePK, (req, res) => {
  try {
    const { queueId } = req.params;
    const pkId = req.user.pk_id;

    // Verify queue is assigned to this PK
    const queue = db.prepare(`
      SELECT * FROM queue WHERE id = ? AND assigned_to_pk_id = ?
    `).get(queueId, pkId);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found or not assigned to you' });
    }

    if (queue.status !== 'waiting') {
      return res.status(400).json({ error: 'Queue is not in waiting status' });
    }

    // Update queue status to 'called' and set accepted_at
    db.prepare(`
      UPDATE queue 
      SET status = 'called', 
          accepted_at = CURRENT_TIMESTAMP,
          called_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(queueId);

    // Get updated queue with full details
    const updatedQueue = db.prepare(`
      SELECT q.*, 
             s.name as service_name,
             p.name as pk_name,
             c.name as client_full_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.id = ?
    `).get(queueId);

    res.json({
      message: 'Queue accepted and client called',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('Error accepting queue:', error);
    res.status(500).json({ error: 'Failed to accept queue' });
  }
});

// Start serving (PK mulai melayani klien)
router.post('/:queueId/start-serving', authenticateToken, requirePK, (req, res) => {
  try {
    const { queueId } = req.params;
    const pkId = req.user.pk_id;

    const queue = db.prepare(`
      SELECT * FROM queue WHERE id = ? AND assigned_to_pk_id = ?
    `).get(queueId, pkId);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'called') {
      return res.status(400).json({ error: 'Queue must be in called status' });
    }

    db.prepare(`
      UPDATE queue 
      SET status = 'serving',
          serving_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(queueId);

    const updatedQueue = db.prepare(`
      SELECT q.*, 
             s.name as service_name,
             p.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      WHERE q.id = ?
    `).get(queueId);

    res.json({
      message: 'Started serving client',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('Error starting service:', error);
    res.status(500).json({ error: 'Failed to start service' });
  }
});

// Complete service (PK selesai melayani)
router.post('/:queueId/complete', authenticateToken, requirePK, (req, res) => {
  try {
    const { queueId } = req.params;
    const { notes } = req.body;
    const pkId = req.user.pk_id;

    const queue = db.prepare(`
      SELECT * FROM queue WHERE id = ? AND assigned_to_pk_id = ?
    `).get(queueId, pkId);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'serving') {
      return res.status(400).json({ error: 'Queue must be in serving status' });
    }

    db.prepare(`
      UPDATE queue 
      SET status = 'completed',
          completed_at = CURRENT_TIMESTAMP,
          notes = ?
      WHERE id = ?
    `).run(notes || null, queueId);

    const updatedQueue = db.prepare(`
      SELECT q.*, 
             s.name as service_name,
             p.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      WHERE q.id = ?
    `).get(queueId);

    res.json({
      message: 'Service completed',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('Error completing service:', error);
    res.status(500).json({ error: 'Failed to complete service' });
  }
});

// Get PK profile
router.get('/profile', authenticateToken, requirePK, (req, res) => {
  try {
    const pkId = req.user.pk_id;

    const pkProfile = db.prepare(`
      SELECT id, name, nip, phone, jabatan, email, address
      FROM pk
      WHERE id = ?
    `).get(pkId);

    if (!pkProfile) {
      return res.status(404).json({ error: 'PK profile not found' });
    }

    res.json(pkProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get queue history for this PK
router.get('/history', authenticateToken, requirePK, (req, res) => {
  try {
    const pkId = req.user.pk_id;
    const { limit = 50, offset = 0 } = req.query;

    const history = db.prepare(`
      SELECT q.*, 
             s.name as service_name,
             c.name as client_full_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.assigned_to_pk_id = ?
        AND q.status = 'completed'
      ORDER BY q.completed_at DESC
      LIMIT ? OFFSET ?
    `).all(pkId, parseInt(limit), parseInt(offset));

    const total = db.prepare(`
      SELECT COUNT(*) as count FROM queue 
      WHERE assigned_to_pk_id = ? AND status = 'completed'
    `).get(pkId).count;

    res.json({
      history,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
