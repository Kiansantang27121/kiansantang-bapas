import express from 'express';
import db from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get pending queues for petugas (ALL waiting queues)
router.get('/pending-queues', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  try {
    const query = `
      SELECT 
        q.*,
        s.name as service_name,
        s.estimated_time,
        p.name as pk_name,
        p.jabatan as pk_jabatan,
        c.name as client_full_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.status = 'waiting'
      ORDER BY q.created_at ASC
    `;
    
    const queues = db.prepare(query).all();
    console.log(`📋 Pending queues: ${queues.length} items`);
    res.json({ success: true, queues });
  } catch (error) {
    console.error('❌ Error fetching pending queues:', error);
    res.status(500).json({ success: false, message: 'Error fetching pending queues', error: error.message });
  }
});

// Auto-assign PK based on jabatan (kategori)
router.post('/auto-assign-pk', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  const { queue_id } = req.body;

  try {
    // Get queue with client's PK
    const queue = db.prepare(`
      SELECT q.*, c.pk_id, p.jabatan
      FROM queue q
      LEFT JOIN clients c ON q.client_id = c.id
      LEFT JOIN pk p ON c.pk_id = p.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    let assigned_pk_id = queue.pk_id;

    // If no PK assigned, try to find based on jabatan
    if (!assigned_pk_id && queue.jabatan) {
      // Find user with matching jabatan
      const pkUser = db.prepare(`
        SELECT u.id, u.name, p.jabatan
        FROM users u
        JOIN pk p ON u.pk_id = p.id
        WHERE u.role = 'pk' AND p.jabatan = ?
        LIMIT 1
      `).get(queue.jabatan);

      if (pkUser) {
        assigned_pk_id = pkUser.id;
      }
    }

    // If still no PK, assign to any available PK
    if (!assigned_pk_id) {
      const anyPK = db.prepare(`
        SELECT id FROM users WHERE role = 'pk' LIMIT 1
      `).get();

      if (anyPK) {
        assigned_pk_id = anyPK.id;
      }
    }

    if (!assigned_pk_id) {
      return res.status(400).json({ success: false, message: 'No PK available' });
    }

    // Update queue with assigned PK
    db.prepare(`
      UPDATE queue SET pk_id = ? WHERE id = ?
    `).run(assigned_pk_id, queue_id);

    // Get updated queue info
    const updatedQueue = db.prepare(`
      SELECT q.*, s.name as service_name, u.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN users u ON q.pk_id = u.id
      WHERE q.id = ?
    `).get(queue_id);

    res.json({ 
      success: true, 
      message: 'PK assigned automatically',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('❌ Error auto-assigning PK:', error);
    res.status(500).json({ success: false, message: 'Error auto-assigning PK', error: error.message });
  }
});

// Assign queue to PK (manual)
router.post('/assign-to-pk', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  const { queue_id, pk_id, notes } = req.body;
  const petugas_id = req.user.id;

  try {
    // Get queue info
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name 
      FROM queue q 
      JOIN services s ON q.service_id = s.id 
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    // Update queue with PK assignment
    db.prepare('UPDATE queue SET pk_id = ? WHERE id = ?').run(pk_id, queue_id);

    // Create notification (simple log for now)
    console.log(`✅ Queue ${queue.queue_number} assigned to PK ${pk_id} by petugas ${petugas_id}`);
    if (notes) {
      console.log(`   Notes: ${notes}`);
    }

    res.json({ 
      success: true, 
      message: 'Queue assigned to PK successfully',
      queue_number: queue.queue_number,
      pk_id: pk_id
    });
  } catch (error) {
    console.error('Error assigning queue to PK:', error);
    res.status(500).json({ success: false, message: 'Error assigning queue to PK', error: error.message });
  }
});

// Get queues assigned to PK (for PK dashboard)
router.get('/my-assignments', authenticateToken, requireRole(['pk']), (req, res) => {
  try {
    const user = req.user;
    
    console.log(`📋 Fetching assignments for user: ${user.username} (${user.name})`);
    
    // Determine jabatan from username
    let jabatan = null;
    if (user.username === 'apk') {
      jabatan = 'APK';
    } else if (user.username === 'pk_madya') {
      jabatan = 'PK Madya';
    } else if (user.username === 'pk_muda') {
      jabatan = 'PK Muda';
    } else if (user.username === 'pk_pertama') {
      jabatan = 'PK Pertama';
    }
    
    if (!jabatan) {
      console.log('⚠️  No jabatan mapping for username:', user.username);
      return res.json({ success: true, assignments: [] });
    }
    
    console.log(`🎯 Looking for queues with PK jabatan: ${jabatan}`);
    
    // Get queues that need PK action (belum di-approve, belum dipanggil ke ruangan)
    const needActionQuery = `
      SELECT 
        q.*,
        s.name as service_name,
        s.estimated_time,
        p.name as pk_name,
        p.jabatan as pk_jabatan,
        u.name as assigned_by_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE p.jabatan = ?
      AND q.status = 'waiting'
      AND q.pk_approved_at IS NULL
      AND q.pk_called_at IS NULL
      ORDER BY q.created_at DESC
    `;
    
    const needAction = db.prepare(needActionQuery).all(jabatan);
    
    // Get queues in process (sudah approve, sudah dipanggil, atau sedang dilayani)
    const inProcessQuery = `
      SELECT 
        q.*,
        s.name as service_name,
        s.estimated_time,
        p.name as pk_name,
        p.jabatan as pk_jabatan,
        u.name as assigned_by_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN users u ON q.operator_id = u.id
      WHERE p.jabatan = ?
      AND (q.pk_called_at IS NOT NULL OR q.status = 'called')
      ORDER BY q.created_at DESC
    `;
    
    const inProcess = db.prepare(inProcessQuery).all(jabatan);
    
    console.log(`✅ Found ${needAction.length} need action, ${inProcess.length} in process for ${jabatan}`);
    
    res.json({ 
      success: true, 
      assignments: needAction,  // Antrian yang perlu aksi PK
      in_process: inProcess     // Antrian yang sudah dalam proses
    });
  } catch (error) {
    console.error('Error fetching PK assignments:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
});

// PK Action: Approve/Reject/Transfer
router.post('/pk-action', authenticateToken, requireRole(['pk']), (req, res) => {
  const { queue_id, action, reason, transfer_to_pk_id } = req.body;
  const user = req.user;

  try {
    // Validate action
    if (!['approve', 'reject', 'transfer'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    // Get queue with PK info
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, p.jabatan as pk_jabatan, p.id as pk_table_id
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }
    
    // Determine jabatan from username
    let userJabatan = null;
    if (user.username === 'apk') userJabatan = 'APK';
    else if (user.username === 'pk_madya') userJabatan = 'PK Madya';
    else if (user.username === 'pk_muda') userJabatan = 'PK Muda';
    else if (user.username === 'pk_pertama') userJabatan = 'PK Pertama';
    
    // Check if queue's PK jabatan matches user's jabatan
    if (queue.pk_jabatan !== userJabatan) {
      return res.status(403).json({ success: false, message: 'Queue not assigned to your jabatan' });
    }
    
    const pk_id = queue.pk_table_id;

    if (action === 'approve') {
      // Mark as approved (ready to call)
      db.prepare('UPDATE queue SET status = ?, pk_approved_at = CURRENT_TIMESTAMP WHERE id = ?').run('waiting', queue_id);
      
      console.log(`✅ Queue ${queue.queue_number} approved by PK ${pk_id}`);

    } else if (action === 'reject') {
      // Mark as rejected
      db.prepare('UPDATE queue SET status = ?, pk_id = NULL WHERE id = ?').run('rejected', queue_id);
      
      console.log(`❌ Queue ${queue.queue_number} rejected by PK ${pk_id}. Reason: ${reason || 'No reason'}`);

    } else if (action === 'transfer') {
      if (!transfer_to_pk_id) {
        return res.status(400).json({ success: false, message: 'Transfer PK ID required' });
      }
      
      // Transfer to another PK
      db.prepare('UPDATE queue SET pk_id = ? WHERE id = ?').run(transfer_to_pk_id, queue_id);
      
      console.log(`↪️  Queue ${queue.queue_number} transferred from PK ${pk_id} to PK ${transfer_to_pk_id}`);
    }

    res.json({ 
      success: true, 
      message: `Queue ${action}ed successfully`,
      action: action
    });
  } catch (error) {
    console.error('Error processing PK action:', error);
    res.status(500).json({ success: false, message: 'Error processing action', error: error.message });
  }
});

// Get approved queues ready to call
router.get('/ready-to-call', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  try {
    const query = `
      SELECT 
        q.*,
        s.name as service_name,
        s.estimated_time,
        pk.name as pk_name,
        wf.action as workflow_action,
        wf.updated_at as workflow_updated_at
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk ON q.pk_id = pk.id
      LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
      WHERE q.status = 'waiting'
      AND q.pk_id IS NOT NULL
      AND q.pk_called_at IS NULL
      AND (wf.action = 'approve' OR wf.action IS NULL)
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      ORDER BY q.created_at ASC
    `;
    
    const queues = db.prepare(query).all();
    
    console.log(`📋 Ready to call: ${queues.length} queues (with PK assigned, not yet called)`);
    
    // Add workflow_id for compatibility (use queue id)
    const queuesWithWorkflow = queues.map(q => ({
      ...q,
      workflow_id: q.id
    }));
    
    res.json({ success: true, queues: queuesWithWorkflow });
  } catch (error) {
    console.error('Error fetching ready to call queues:', error);
    res.status(500).json({ success: false, message: 'Error fetching queues', error: error.message });
  }
});

// Get available rooms
router.get('/available-rooms', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  try {
    const rooms = db.prepare('SELECT * FROM rooms WHERE is_available = 1 ORDER BY room_number').all();
    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ success: false, message: 'Error fetching rooms', error: error.message });
  }
});

// Forward to PK (Meneruskan ke PK) - Auto assign and call
router.post('/forward-to-pk', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  const { queue_id, room_number } = req.body;

  try {
    // Get queue with PK info
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, p.name as pk_name, p.jabatan as pk_jabatan
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    let assigned_pk_id = queue.pk_id;
    let pk_name = queue.pk_name;
    
    console.log(`📋 Queue ${queue.queue_number}: pk_id=${assigned_pk_id}, pk_name=${pk_name}`);

    // If no PK assigned, auto-assign based on jabatan
    if (!assigned_pk_id && queue.jabatan) {
      const pkUser = db.prepare(`
        SELECT u.id, u.name, p.id as pk_table_id, p.name as pk_full_name
        FROM users u
        JOIN pk p ON u.pk_id = p.id
        WHERE u.role = 'pk' AND p.jabatan = ?
        LIMIT 1
      `).get(queue.jabatan);

      if (pkUser) {
        assigned_pk_id = pkUser.pk_table_id;
        pk_name = pkUser.pk_full_name;
        
        // Update queue with assigned PK
        db.prepare('UPDATE queue SET pk_id = ? WHERE id = ?').run(assigned_pk_id, queue_id);
      }
    }

    // If still no PK, assign to any available PK
    if (!assigned_pk_id) {
      const anyPK = db.prepare(`
        SELECT p.id, p.name FROM pk p LIMIT 1
      `).get();

      if (anyPK) {
        assigned_pk_id = anyPK.id;
        pk_name = anyPK.name;
        db.prepare('UPDATE queue SET pk_id = ? WHERE id = ?').run(assigned_pk_id, queue_id);
      }
    }

    if (!assigned_pk_id) {
      return res.status(400).json({ success: false, message: 'No PK available' });
    }

    // Check if room is available
    const room = db.prepare('SELECT * FROM rooms WHERE room_number = ?').get(room_number);
    if (!room || !room.is_available) {
      return res.status(400).json({ success: false, message: 'Room not available' });
    }

    // Update queue with room and pk_called_at
    db.prepare(`
      UPDATE queue 
      SET room_number = ?, pk_called_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(room_number, queue_id);

    // Reserve room for this PK
    db.prepare(`
      UPDATE rooms 
      SET is_available = 0, current_pk_id = ?, current_queue_id = ? 
      WHERE room_number = ?
    `).run(assigned_pk_id, queue_id, room_number);

    console.log(`📢 Queue ${queue.queue_number} forwarded to PK ${pk_name} at room ${room_number}`);

    const callData = {
      type: 'pk',
      pk_name: pk_name,
      client_name: queue.client_name,
      room_number,
      queue_number: queue.queue_number,
      auto_assigned: !queue.pk_id // Flag if auto-assigned
    };

    // Emit socket event for display
    const io = req.app.get('io');
    if (io) {
      io.emit('pk:called', callData);
    }

    res.json({ 
      success: true, 
      message: 'Queue forwarded to PK and called successfully',
      call_data: callData
    });
  } catch (error) {
    console.error('❌ Error forwarding to PK:', error);
    res.status(500).json({ success: false, message: 'Error forwarding to PK', error: error.message });
  }
});

// Call PK to enter room (Panggilan 1: PK masuk ruangan)
router.post('/call-pk', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  const { queue_id, room_number } = req.body;

  try {
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, p.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    if (!queue.pk_id) {
      return res.status(400).json({ success: false, message: 'Queue not assigned to PK' });
    }

    // Check if room is available
    const room = db.prepare('SELECT * FROM rooms WHERE room_number = ?').get(room_number);
    if (!room || !room.is_available) {
      return res.status(400).json({ success: false, message: 'Room not available' });
    }

    // Update queue with room and pk_called_at
    db.prepare(`
      UPDATE queue 
      SET room_number = ?, pk_called_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(room_number, queue_id);

    // Reserve room for this PK
    db.prepare(`
      UPDATE rooms 
      SET is_available = 0, current_pk_id = ?, current_queue_id = ? 
      WHERE room_number = ?
    `).run(queue.pk_id, queue_id, room_number);

    console.log(`📢 PK ${queue.pk_name} called to room ${room_number} for queue ${queue.queue_number} - Client: ${queue.client_name}`);

    const callData = {
      type: 'pk',
      pk_name: queue.pk_name,
      client_name: queue.client_name,
      room_number,
      queue_number: queue.queue_number
    };

    // Emit socket event for display
    const io = req.app.get('io');
    if (io) {
      io.emit('pk:called', callData);
    }

    res.json({ 
      success: true, 
      message: 'PK called to room successfully',
      call_data: callData
    });
  } catch (error) {
    console.error('Error calling PK:', error);
    res.status(500).json({ success: false, message: 'Error calling PK', error: error.message });
  }
});

// PK confirms entry to room
router.post('/pk-enter-room', authenticateToken, requireRole(['pk']), (req, res) => {
  const { queue_id } = req.body;
  const user = req.user;

  try {
    // Get queue with PK info
    const queue = db.prepare(`
      SELECT q.*, p.jabatan as pk_jabatan, p.name as pk_name, s.name as service_name
      FROM queue q
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN services s ON q.service_id = s.id
      WHERE q.id = ?
    `).get(queue_id);
    
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }
    
    // Determine jabatan from username
    let userJabatan = null;
    if (user.username === 'apk') userJabatan = 'APK';
    else if (user.username === 'pk_madya') userJabatan = 'PK Madya';
    else if (user.username === 'pk_muda') userJabatan = 'PK Muda';
    else if (user.username === 'pk_pertama') userJabatan = 'PK Pertama';
    
    // Check if queue's PK jabatan matches user's jabatan
    if (queue.pk_jabatan !== userJabatan) {
      return res.status(403).json({ success: false, message: 'Queue not assigned to your jabatan' });
    }

    // Update pk_entered_at AND auto-call client
    db.prepare(`
      UPDATE queue 
      SET pk_entered_at = CURRENT_TIMESTAMP, 
          client_called_at = CURRENT_TIMESTAMP,
          status = 'called'
      WHERE id = ?
    `).run(queue_id);

    console.log(`✅ PK entered room ${queue.room_number} for queue ${queue.queue_number}`);
    console.log(`📢 Auto-calling client ${queue.client_name} to room ${queue.room_number}`);

    const io = req.app.get('io');
    
    // Emit PK entered event
    if (io) {
      io.emit('pk:entered', {
        queue_number: queue.queue_number,
        room_number: queue.room_number,
        pk_name: queue.pk_name
      });
      
      // Auto-emit client call event
      io.emit('client:called', {
        type: 'client',
        queue_number: queue.queue_number,
        client_name: queue.client_name,
        room_number: queue.room_number,
        pk_name: queue.pk_name,
        auto_called: true
      });
    }

    res.json({ 
      success: true, 
      message: 'PK entered room and client auto-called successfully',
      room_number: queue.room_number,
      call_data: {
        type: 'client',
        queue_number: queue.queue_number,
        client_name: queue.client_name,
        room_number: queue.room_number,
        pk_name: queue.pk_name,
        auto_called: true
      }
    });
  } catch (error) {
    console.error('Error confirming PK entry:', error);
    res.status(500).json({ success: false, message: 'Error confirming entry', error: error.message });
  }
});

// Call client to enter room (Panggilan 2: Klien masuk ruangan) - by Petugas
router.post('/call-client', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator']), (req, res) => {
  const { queue_id } = req.body;

  try {
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, pk.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk ON q.pk_id = pk.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }

    if (!queue.pk_entered_at) {
      return res.status(400).json({ success: false, message: 'PK has not entered the room yet' });
    }

    // Update queue with client_called_at and status
    db.prepare(`
      UPDATE queue 
      SET client_called_at = CURRENT_TIMESTAMP, status = 'called'
      WHERE id = ?
    `).run(queue_id);

    console.log(`📢 Client ${queue.client_name} called to room ${queue.room_number} (queue ${queue.queue_number})`);

    res.json({ 
      success: true, 
      message: 'Client called to room successfully',
      call_data: {
        type: 'client',
        queue_number: queue.queue_number,
        client_name: queue.client_name,
        room_number: queue.room_number,
        pk_name: queue.pk_name
      }
    });
  } catch (error) {
    console.error('Error calling client:', error);
    res.status(500).json({ success: false, message: 'Error calling client', error: error.message });
  }
});

// PK calls client to enter room (called by PK after entering room)
router.post('/pk-call-client', authenticateToken, requireRole(['pk']), (req, res) => {
  const { queue_id } = req.body;
  const user = req.user;

  try {
    // Get queue with PK info
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, p.name as pk_name, p.jabatan as pk_jabatan
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      WHERE q.id = ?
    `).get(queue_id);

    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found' });
    }
    
    // Determine jabatan from username
    let userJabatan = null;
    if (user.username === 'apk') userJabatan = 'APK';
    else if (user.username === 'pk_madya') userJabatan = 'PK Madya';
    else if (user.username === 'pk_muda') userJabatan = 'PK Muda';
    else if (user.username === 'pk_pertama') userJabatan = 'PK Pertama';
    
    // Check if queue's PK jabatan matches user's jabatan
    if (queue.pk_jabatan !== userJabatan) {
      return res.status(403).json({ success: false, message: 'Queue not assigned to your jabatan' });
    }

    if (!queue.pk_entered_at) {
      return res.status(400).json({ success: false, message: 'You have not entered the room yet' });
    }

    if (queue.client_called_at) {
      return res.status(400).json({ success: false, message: 'Client already called' });
    }

    // Update queue with client_called_at and status
    db.prepare(`
      UPDATE queue 
      SET client_called_at = CURRENT_TIMESTAMP, status = 'called'
      WHERE id = ?
    `).run(queue_id);

    console.log(`📢 PK ${queue.pk_name} called client ${queue.client_name} to room ${queue.room_number} (queue ${queue.queue_number})`);

    const callData = {
      type: 'client',
      queue_number: queue.queue_number,
      client_name: queue.client_name,
      room_number: queue.room_number,
      pk_name: queue.pk_name
    };

    // Emit socket event for display
    const io = req.app.get('io');
    if (io) {
      io.emit('client:called', callData);
    }

    res.json({ 
      success: true, 
      message: 'Client called to room successfully',
      call_data: callData
    });
  } catch (error) {
    console.error('Error calling client:', error);
    res.status(500).json({ success: false, message: 'Error calling client', error: error.message });
  }
});

// Get notifications for user (simplified)
router.get('/notifications', authenticateToken, (req, res) => {
  try {
    // For now, return empty array
    // Can be implemented later with proper notifications table
    res.json({ success: true, notifications: [] });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, (req, res) => {
  try {
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
});

// Get workflow history
router.get('/history/:queue_id', authenticateToken, (req, res) => {
  try {
    const { queue_id } = req.params;
    
    // For now, return basic queue info
    const queue = db.prepare(`
      SELECT q.*, s.name as service_name, u.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN users u ON q.pk_id = u.id
      WHERE q.id = ?
    `).get(queue_id);
    
    const history = queue ? [{
      action: 'created',
      created_at: queue.created_at,
      performed_by_name: 'System'
    }] : [];
    
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching workflow history:', error);
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

// Get workflow activities for display
router.get('/activities', (req, res) => {
  try {
    const query = `
      SELECT 
        q.id,
        q.queue_number,
        q.client_name,
        q.status,
        q.room_number,
        q.pk_called_at,
        q.pk_entered_at,
        q.client_called_at,
        q.completed_at,
        pk.name as pk_name,
        s.name as service_name
      FROM queue q
      LEFT JOIN pk ON q.pk_id = pk.id
      LEFT JOIN services s ON q.service_id = s.id
      WHERE DATE(q.created_at) = DATE('now')
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      ORDER BY q.created_at DESC
      LIMIT 20
    `;
    
    const queues = db.prepare(query).all();
    
    // Convert to activities
    const activities = [];
    queues.forEach(q => {
      if (q.completed_at) {
        activities.push({
          type: 'completed',
          queue_number: q.queue_number,
          client_name: q.client_name,
          pk_name: q.pk_name,
          room_number: q.room_number,
          timestamp: q.completed_at,
          status: 'completed'
        });
      }
      if (q.client_called_at) {
        activities.push({
          type: 'client_called',
          queue_number: q.queue_number,
          client_name: q.client_name,
          pk_name: q.pk_name,
          room_number: q.room_number,
          timestamp: q.client_called_at,
          status: 'in_progress'
        });
      }
      if (q.pk_entered_at) {
        activities.push({
          type: 'pk_entered',
          queue_number: q.queue_number,
          client_name: q.client_name,
          pk_name: q.pk_name,
          room_number: q.room_number,
          timestamp: q.pk_entered_at,
          status: 'in_progress'
        });
      }
      if (q.pk_called_at) {
        activities.push({
          type: 'pk_called',
          queue_number: q.queue_number,
          client_name: q.client_name,
          pk_name: q.pk_name,
          room_number: q.room_number,
          timestamp: q.pk_called_at,
          status: 'in_progress'
        });
      }
    });
    
    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ success: true, activities: activities.slice(0, 20) });
  } catch (error) {
    console.error('Error fetching PK entered queues:', error);
    res.status(500).json({ success: false, message: 'Error fetching queues', error: error.message });
  }
});

// Get workflow stats for display
router.get('/stats', authenticateToken, requireRole(['admin', 'petugas_layanan', 'operator', 'pk']), (req, res) => {
  try {
    const waiting = db.prepare(`
      SELECT COUNT(*) as count FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.status = 'waiting'
      AND q.pk_entered_at IS NULL
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      AND DATE(q.created_at) = DATE('now')
    `).get();
    
    const pkCalled = db.prepare(`
      SELECT COUNT(*) as count FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.pk_called_at IS NOT NULL
      AND q.pk_entered_at IS NULL
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      AND DATE(q.created_at) = DATE('now')
    `).get();
    
    const pkEntered = db.prepare(`
      SELECT COUNT(*) as count FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.pk_entered_at IS NOT NULL
      AND q.client_called_at IS NULL
      AND q.completed_at IS NULL
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      AND DATE(q.created_at) = DATE('now')
    `).get();
    
    const clientCalled = db.prepare(`
      SELECT COUNT(*) as count FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.client_called_at IS NOT NULL
      AND q.completed_at IS NULL
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      AND DATE(q.created_at) = DATE('now')
    `).get();
    
    const completed = db.prepare(`
      SELECT COUNT(*) as count FROM queue q
      JOIN services s ON q.service_id = s.id
      WHERE q.status = 'completed'
      AND s.name LIKE '%Bimbingan Wajib Lapor%'
      AND DATE(q.created_at) = DATE('now')
    `).get();
    
    res.json({
      success: true,
      stats: {
        waiting: waiting.count || 0,
        pkCalled: pkCalled.count || 0,
        pkEntered: pkEntered.count || 0,
        clientCalled: clientCalled.count || 0,
        completed: completed.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

export default router;
