import express from 'express';
import db from '../database.js';
import { authenticateToken, requireOperator } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Generate queue number based on settings
function generateQueueNumber(serviceId) {
  // Get settings
  const getSetting = (key, defaultValue) => {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return setting ? setting.value : defaultValue;
  };

  const prefixType = getSetting('queue_number_prefix_type', 'service');
  const customPrefix = getSetting('queue_number_custom_prefix', 'A');
  const dateFormat = getSetting('queue_number_date_format', 'YYYYMMDD');
  const digits = parseInt(getSetting('queue_number_digits', '3'));
  const separator = getSetting('queue_number_separator', '');
  const resetDaily = getSetting('queue_reset_daily', 'true') === 'true';
  const startNumber = parseInt(getSetting('queue_start_number', '1'));

  // Generate prefix
  let prefix = '';
  if (prefixType === 'service') {
    const service = db.prepare('SELECT name FROM services WHERE id = ?').get(serviceId);
    prefix = service.name.substring(0, 1).toUpperCase();
  } else {
    prefix = customPrefix;
  }

  // Generate date part
  let datePart = '';
  if (dateFormat !== 'none') {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    switch (dateFormat) {
      case 'YYYYMMDD':
        datePart = year + month + day;
        break;
      case 'YYMMDD':
        datePart = year.substring(2) + month + day;
        break;
      case 'DDMMYY':
        datePart = day + month + year.substring(2);
        break;
      case 'DDMMYYYY':
        datePart = day + month + year;
        break;
      default:
        datePart = year + month + day;
    }
  }

  // Get count
  let count;
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  if (resetDaily) {
    count = db.prepare(
      'SELECT COUNT(*) as count FROM queue WHERE DATE(created_at) = ? AND service_id = ?'
    ).get(today, serviceId);
  } else {
    count = db.prepare(
      'SELECT COUNT(*) as count FROM queue WHERE service_id = ?'
    ).get(serviceId);
  }

  const number = String(count.count + startNumber).padStart(digits, '0');

  // Build queue number
  const parts = [];
  if (prefix) parts.push(prefix);
  if (datePart) parts.push(datePart);
  parts.push(number);

  const queueNumber = parts.join(separator);
  
  // Check if queue number already exists (safety check)
  const existing = db.prepare('SELECT id FROM queue WHERE queue_number = ?').get(queueNumber);
  if (existing) {
    // If exists, add a random suffix to make it unique
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return queueNumber + '-' + randomSuffix;
  }
  
  return queueNumber;
}

// Create new queue (public - for registration app)
router.post('/', (req, res) => {
  try {
    const { service_id, client_name, client_phone, client_nik, pk_id, client_id, operator_id } = req.body;

    if (!service_id || !client_name) {
      return res.status(400).json({ error: 'Service and client name required' });
    }

    const service = db.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').get(service_id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found or inactive' });
    }

    // Validate pk_id if provided
    let validPkId = null;
    if (pk_id) {
      const pk = db.prepare('SELECT id FROM pk WHERE id = ?').get(pk_id);
      if (pk) {
        validPkId = pk_id;
      } else {
        console.warn(`PK ID ${pk_id} not found, setting to null`);
      }
    }

    // Validate client_id if provided
    let validClientId = null;
    if (client_id) {
      const client = db.prepare('SELECT id FROM clients WHERE id = ?').get(client_id);
      if (client) {
        validClientId = client_id;
      } else {
        console.warn(`Client ID ${client_id} not found, setting to null`);
      }
    }

    const queueNumber = generateQueueNumber(service_id);

    const result = db.prepare(
      'INSERT INTO queue (queue_number, service_id, client_name, client_phone, client_nik, pk_id, client_id, operator_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(queueNumber, service_id, client_name, client_phone, client_nik, validPkId, validClientId, operator_id || null, 'waiting');

    const queueId = result.lastInsertRowid;

    // NOTE: Do NOT auto-create workflow record here
    // Workflow record should only be created when PK approves the queue
    // This allows PK to verify and approve/reject the assignment
    if (pk_id) {
      console.log(`📋 Queue ${queueNumber} created with PK ${pk_id} - waiting for PK verification`);
    }

    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             p.name as pk_name, c.name as client_full_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.id = ?
    `).get(queueId);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('queue:new', queue);

    res.status(201).json(queue);
  } catch (error) {
    console.error('Create queue error:', error);
    res.status(500).json({ error: 'Failed to create queue' });
  }
});

// Get all queues (with filters)
router.get('/', (req, res) => {
  try {
    const { status, date, service_id } = req.query;
    let query = `
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND q.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(q.created_at) = DATE(?)';
      params.push(date);
    } else {
      query += ' AND DATE(q.created_at) = CURRENT_DATE';
    }

    if (service_id) {
      query += ' AND q.service_id = ?';
      params.push(service_id);
    }

    query += ' ORDER BY q.created_at DESC';

    const queues = db.prepare(query).all(...params);
    res.json(queues);
  } catch (error) {
    console.error('Get queues error:', error);
    res.status(500).json({ error: 'Failed to fetch queues' });
  }
});

// Get queue by ID or queue number
router.get('/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    let queue;

    if (isNaN(identifier)) {
      // Search by queue number
      queue = db.prepare(`
        SELECT q.*, s.name as service_name, s.estimated_time,
               u.name as operator_name
        FROM queue q 
        JOIN services s ON q.service_id = s.id 
        LEFT JOIN users u ON q.operator_id = u.id
        WHERE q.queue_number = ?
      `).get(identifier);
    } else {
      // Search by ID
      queue = db.prepare(`
        SELECT q.*, s.name as service_name, s.estimated_time,
               u.name as operator_name
        FROM queue q 
        JOIN services s ON q.service_id = s.id 
        LEFT JOIN users u ON q.operator_id = u.id
        WHERE q.id = ?
      `).get(identifier);
    }

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    res.json(queue);
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Assign queue to PK (operator)
router.post('/:id/assign-pk', authenticateToken, requireOperator, (req, res) => {
  try {
    const { pk_id } = req.body;

    if (!pk_id) {
      return res.status(400).json({ error: 'PK ID required' });
    }

    const queue = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'waiting') {
      return res.status(400).json({ error: 'Queue is not in waiting status' });
    }

    // Verify PK exists
    const pk = db.prepare('SELECT * FROM pk WHERE id = ? AND is_active = 1').get(pk_id);
    if (!pk) {
      return res.status(404).json({ error: 'PK not found or inactive' });
    }

    // Assign queue to PK
    db.prepare(
      'UPDATE queue SET assigned_to_pk_id = ?, operator_id = ? WHERE id = ?'
    ).run(pk_id, req.user.id, req.params.id);

    const updated = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name,
             p.name as assigned_pk_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      WHERE q.id = ?
    `).get(req.params.id);

    // Emit socket event to notify PK
    const io = req.app.get('io');
    io.emit('queue:assigned', updated);
    io.emit(`pk:${pk_id}:new-queue`, updated);

    res.json(updated);
  } catch (error) {
    console.error('Assign queue error:', error);
    res.status(500).json({ error: 'Failed to assign queue' });
  }
});

// Call queue (operator)
router.post('/:id/call', authenticateToken, requireOperator, (req, res) => {
  try {
    const { counter_number } = req.body;

    if (!counter_number) {
      return res.status(400).json({ error: 'Counter number required' });
    }

    const queue = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'waiting') {
      return res.status(400).json({ error: 'Queue is not in waiting status' });
    }

    db.prepare(
      'UPDATE queue SET status = ?, counter_number = ?, operator_id = ?, called_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run('called', counter_number, req.user.id, req.params.id);

    const updated = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE q.id = ?
    `).get(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('queue:called', updated);

    res.json(updated);
  } catch (error) {
    console.error('Call queue error:', error);
    res.status(500).json({ error: 'Failed to call queue' });
  }
});

// Start serving queue (operator)
router.post('/:id/serve', authenticateToken, requireOperator, (req, res) => {
  try {
    const queue = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'called') {
      return res.status(400).json({ error: 'Queue must be called first' });
    }

    db.prepare(
      'UPDATE queue SET status = ?, serving_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run('serving', req.params.id);

    const updated = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE q.id = ?
    `).get(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('queue:serving', updated);

    res.json(updated);
  } catch (error) {
    console.error('Serve queue error:', error);
    res.status(500).json({ error: 'Failed to serve queue' });
  }
});

// Complete queue (operator)
router.post('/:id/complete', authenticateToken, requireOperator, (req, res) => {
  try {
    const { notes } = req.body;

    const queue = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'serving') {
      return res.status(400).json({ error: 'Queue must be in serving status' });
    }

    db.prepare(
      'UPDATE queue SET status = ?, notes = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run('completed', notes, req.params.id);

    const updated = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE q.id = ?
    `).get(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('queue:completed', updated);

    res.json(updated);
  } catch (error) {
    console.error('Complete queue error:', error);
    res.status(500).json({ error: 'Failed to complete queue' });
  }
});

// Cancel queue (operator)
router.post('/:id/cancel', authenticateToken, requireOperator, (req, res) => {
  try {
    const { notes } = req.body;

    const queue = db.prepare('SELECT * FROM queue WHERE id = ?').get(req.params.id);
    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    db.prepare(
      'UPDATE queue SET status = ?, notes = ? WHERE id = ?'
    ).run('cancelled', notes, req.params.id);

    const updated = db.prepare(`
      SELECT q.*, s.name as service_name, s.estimated_time,
             u.name as operator_name
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE q.id = ?
    `).get(req.params.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('queue:cancelled', updated);

    res.json(updated);
  } catch (error) {
    console.error('Cancel queue error:', error);
    res.status(500).json({ error: 'Failed to cancel queue' });
  }
});

// Get queue statistics
router.get('/stats/today', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
        SUM(CASE WHEN status = 'called' THEN 1 ELSE 0 END) as called,
        SUM(CASE WHEN status = 'serving' THEN 1 ELSE 0 END) as serving,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM queue 
      WHERE DATE(created_at) = CURRENT_DATE
    `).get();

    res.json(stats);
  } catch (error) {
    console.error('Get queue stats error:', error);
    res.status(500).json({ error: 'Failed to fetch queue statistics' });
  }
});

// Reset all queues (Admin only)
router.post('/reset', authenticateToken, requireOperator, (req, res) => {
  try {
    // Get count before reset
    const beforeCount = db.prepare('SELECT COUNT(*) as count FROM queue').get();
    
    // Delete all queues
    db.prepare('DELETE FROM queue').run();
    
    // Also delete workflow records
    db.prepare('DELETE FROM queue_workflow').run();
    
    console.log(`🗑️  Reset: Deleted ${beforeCount.count} queues and their workflow records`);
    
    res.json({ 
      success: true, 
      message: `Berhasil menghapus ${beforeCount.count} antrian`,
      deleted_count: beforeCount.count
    });
  } catch (error) {
    console.error('Reset queue error:', error);
    res.status(500).json({ error: 'Gagal mereset antrian' });
  }
});

// Reset today's queues only (Admin only)
router.post('/reset/today', authenticateToken, requireOperator, (req, res) => {
  try {
    // Get count before reset (SQLite syntax)
    const beforeCount = db.prepare("SELECT COUNT(*) as count FROM queue WHERE DATE(created_at) = DATE('now')").get();
    
    // Get queue IDs to delete workflow records
    const queueIds = db.prepare("SELECT id FROM queue WHERE DATE(created_at) = DATE('now')").all();
    
    // Delete workflow records for today's queues
    if (queueIds.length > 0) {
      const placeholders = queueIds.map(() => '?').join(',');
      db.prepare(`DELETE FROM queue_workflow WHERE queue_id IN (${placeholders})`).run(...queueIds.map(q => q.id));
    }
    
    // Delete today's queues
    db.prepare("DELETE FROM queue WHERE DATE(created_at) = DATE('now')").run();
    
    console.log(`🗑️  Reset Today: Deleted ${beforeCount.count} queues from today`);
    
    res.json({ 
      success: true, 
      message: `Berhasil menghapus ${beforeCount.count} antrian hari ini`,
      deleted_count: beforeCount.count
    });
  } catch (error) {
    console.error('Reset today queue error:', error);
    res.status(500).json({ error: 'Gagal mereset antrian hari ini' });
  }
});

export default router;
