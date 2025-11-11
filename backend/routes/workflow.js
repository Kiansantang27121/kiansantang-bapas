import express from 'express';
import db from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get pending queues for petugas (need PK assignment)
router.get('/pending-queues', authenticateToken, requireRole(['admin', 'petugas', 'petugas_layanan']), (req, res) => {
  try {
    console.log('📋 Fetching pending queues...');
    
    // Get all waiting queues, not just Bimbingan Wajib Lapor
    const query = `
      SELECT 
        q.*,
        s.name as service_name,
        s.estimated_time,
        p.name as pk_name,
        c.name as client_full_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.pk_id = p.id
      LEFT JOIN clients c ON q.client_id = c.id
      WHERE q.status = 'waiting'
      ORDER BY q.created_at ASC
    `;
    
    console.log('🔍 Executing query...');
    const queues = db.prepare(query).all();
    console.log(`✅ Found ${queues.length} pending queues`);
    
    res.json({ success: true, queues });
  } catch (error) {
    console.error('❌ Error fetching pending queues:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching pending queues', error: error.message });
  }
});

// Assign queue to PK
router.post('/assign-to-pk', authenticateToken, requireRole(['admin', 'petugas']), async (req, res) => {
  const { queue_id, pk_id, notes } = req.body;
  const petugas_id = req.user.id;

  try {
    // Check if workflow exists
    const [existing] = await db.query(
      'SELECT id FROM queue_workflow WHERE queue_id = ?',
      [queue_id]
    );

    let workflow_id;

    if (existing.length > 0) {
      // Update existing workflow
      workflow_id = existing[0].id;
      await db.query(
        `UPDATE queue_workflow 
         SET status = 'assigned_to_pk', assigned_pk_id = ?, assigned_by = ?, 
             assigned_at = NOW(), notes = ?
         WHERE id = ?`,
        [pk_id, petugas_id, notes, workflow_id]
      );
    } else {
      // Create new workflow
      const [result] = await db.query(
        `INSERT INTO queue_workflow 
         (queue_id, status, assigned_pk_id, assigned_by, assigned_at, notes)
         VALUES (?, 'assigned_to_pk', ?, ?, NOW(), ?)`,
        [queue_id, pk_id, petugas_id, notes]
      );
      workflow_id = result.insertId;
    }

    // Add to history
    await db.query(
      `INSERT INTO queue_workflow_history 
       (workflow_id, queue_id, action, to_pk_id, performed_by, notes)
       VALUES (?, ?, 'assigned', ?, ?, ?)`,
      [workflow_id, queue_id, pk_id, petugas_id, notes]
    );

    // Create notification for PK
    const [queue] = await db.query(
      'SELECT q.*, s.name as service_name FROM queues q JOIN services s ON q.service_id = s.id WHERE q.id = ?',
      [queue_id]
    );

    await db.query(
      `INSERT INTO notifications 
       (user_id, type, title, message, queue_id, workflow_id)
       VALUES (?, 'pk_assigned', ?, ?, ?, ?)`,
      [
        pk_id,
        'Antrian Baru Ditugaskan',
        `Anda ditugaskan untuk menangani ${queue[0].client_name} - ${queue[0].service_name}. Nomor antrian: ${queue[0].queue_number}`,
        queue_id,
        workflow_id
      ]
    );

    res.json({ success: true, message: 'Queue assigned to PK successfully', workflow_id });
  } catch (error) {
    console.error('Error assigning queue to PK:', error);
    res.status(500).json({ success: false, message: 'Error assigning queue to PK' });
  }
});

// Get queues assigned to PK (for PK dashboard)
router.get('/my-assignments', authenticateToken, requireRole(['pk']), async (req, res) => {
  try {
    const pk_id = req.user.id;
    
    const query = `
      SELECT 
        q.*,
        s.name as service_name,
        wf.id as workflow_id,
        wf.status as workflow_status,
        wf.assigned_at,
        wf.notes,
        petugas.full_name as assigned_by_name
      FROM queue_workflow wf
      JOIN queues q ON wf.queue_id = q.id
      JOIN services s ON q.service_id = s.id
      LEFT JOIN users petugas ON wf.assigned_by = petugas.id
      WHERE wf.assigned_pk_id = ?
      AND wf.status IN ('assigned_to_pk', 'transferred')
      ORDER BY wf.assigned_at DESC
    `;
    
    const [assignments] = await db.query(query, [pk_id]);
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Error fetching PK assignments:', error);
    res.status(500).json({ success: false, message: 'Error fetching assignments' });
  }
});

// PK Action: Approve/Reject/Transfer
router.post('/pk-action', authenticateToken, requireRole(['pk']), async (req, res) => {
  const { workflow_id, action, reason, transfer_to_pk_id } = req.body;
  const pk_id = req.user.id;

  try {
    // Validate action
    if (!['approve', 'reject', 'transfer'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    // Get workflow details
    const [workflow] = await db.query(
      `SELECT wf.*, q.queue_number, q.client_name, s.name as service_name
       FROM queue_workflow wf
       JOIN queues q ON wf.queue_id = q.id
       JOIN services s ON q.service_id = s.id
       WHERE wf.id = ? AND wf.assigned_pk_id = ?`,
      [workflow_id, pk_id]
    );

    if (workflow.length === 0) {
      return res.status(404).json({ success: false, message: 'Workflow not found or not assigned to you' });
    }

    const wf = workflow[0];
    let new_status, notification_type, notification_title, notification_message;

    if (action === 'approve') {
      new_status = 'approved';
      notification_type = 'pk_approved';
      notification_title = 'Antrian Disetujui PK';
      notification_message = `${wf.client_name} (${wf.queue_number}) telah disetujui oleh PK. Siap dipanggil.`;

      await db.query(
        'UPDATE queue_workflow SET status = ?, approved_at = NOW() WHERE id = ?',
        [new_status, workflow_id]
      );

    } else if (action === 'reject') {
      new_status = 'rejected';
      notification_type = 'pk_rejected';
      notification_title = 'Antrian Ditolak PK';
      notification_message = `${wf.client_name} (${wf.queue_number}) ditolak oleh PK. Alasan: ${reason || 'Tidak disebutkan'}`;

      await db.query(
        'UPDATE queue_workflow SET status = ?, rejected_at = NOW(), rejection_reason = ? WHERE id = ?',
        [new_status, reason, workflow_id]
      );

    } else if (action === 'transfer') {
      if (!transfer_to_pk_id) {
        return res.status(400).json({ success: false, message: 'Transfer PK ID required' });
      }

      new_status = 'transferred';
      notification_type = 'pk_transferred';
      
      await db.query(
        'UPDATE queue_workflow SET status = ?, assigned_pk_id = ?, assigned_at = NOW(), notes = ? WHERE id = ?',
        [new_status, transfer_to_pk_id, reason, workflow_id]
      );

      // Notify new PK
      notification_title = 'Antrian Dialihkan ke Anda';
      notification_message = `${wf.client_name} (${wf.queue_number}) dialihkan ke Anda. Catatan: ${reason || 'Tidak ada'}`;

      await db.query(
        `INSERT INTO notifications 
         (user_id, type, title, message, queue_id, workflow_id)
         VALUES (?, 'pk_assigned', ?, ?, ?, ?)`,
        [transfer_to_pk_id, notification_title, notification_message, wf.queue_id, workflow_id]
      );

      // Also notify petugas about transfer
      notification_title = 'Antrian Dialihkan';
      notification_message = `${wf.client_name} (${wf.queue_number}) dialihkan ke PK lain.`;
    }

    // Add to history
    await db.query(
      `INSERT INTO queue_workflow_history 
       (workflow_id, queue_id, action, from_pk_id, to_pk_id, performed_by, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [workflow_id, wf.queue_id, action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'transferred', 
       pk_id, transfer_to_pk_id || null, pk_id, reason]
    );

    // Notify petugas (get assigned_by from workflow)
    if (wf.assigned_by) {
      await db.query(
        `INSERT INTO notifications 
         (user_id, type, title, message, queue_id, workflow_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [wf.assigned_by, notification_type, notification_title, notification_message, wf.queue_id, workflow_id]
      );
    }

    res.json({ 
      success: true, 
      message: `Queue ${action}ed successfully`,
      new_status 
    });
  } catch (error) {
    console.error('Error processing PK action:', error);
    res.status(500).json({ success: false, message: 'Error processing action' });
  }
});

// Get approved queues ready to call
router.get('/ready-to-call', authenticateToken, requireRole(['admin', 'petugas']), async (req, res) => {
  try {
    const query = `
      SELECT 
        q.*,
        s.name as service_name,
        wf.id as workflow_id,
        wf.status as workflow_status,
        wf.approved_at,
        pk.full_name as pk_name
      FROM queue_workflow wf
      JOIN queues q ON wf.queue_id = q.id
      JOIN services s ON q.service_id = s.id
      LEFT JOIN users pk ON wf.assigned_pk_id = pk.id
      WHERE wf.status = 'approved'
      AND q.status = 'waiting'
      ORDER BY wf.approved_at ASC
    `;
    
    const [queues] = await db.query(query);
    res.json({ success: true, queues });
  } catch (error) {
    console.error('Error fetching ready to call queues:', error);
    res.status(500).json({ success: false, message: 'Error fetching queues' });
  }
});

// Call queue (trigger voice announcement)
router.post('/call-queue', authenticateToken, requireRole(['admin', 'petugas']), async (req, res) => {
  const { workflow_id, counter_number } = req.body;

  try {
    const [workflow] = await db.query(
      `SELECT wf.*, q.queue_number, q.client_name, s.name as service_name
       FROM queue_workflow wf
       JOIN queues q ON wf.queue_id = q.id
       JOIN services s ON q.service_id = s.id
       WHERE wf.id = ?`,
      [workflow_id]
    );

    if (workflow.length === 0) {
      return res.status(404).json({ success: false, message: 'Workflow not found' });
    }

    const wf = workflow[0];

    // Update workflow status
    await db.query(
      'UPDATE queue_workflow SET status = ?, called_at = NOW() WHERE id = ?',
      ['called', workflow_id]
    );

    // Update queue status
    await db.query(
      'UPDATE queues SET status = ?, called_at = NOW() WHERE id = ?',
      ['called', wf.queue_id]
    );

    // Add to history
    await db.query(
      `INSERT INTO queue_workflow_history 
       (workflow_id, queue_id, action, performed_by, notes)
       VALUES (?, ?, 'called', ?, ?)`,
      [workflow_id, wf.queue_id, req.user.id, `Called to counter ${counter_number || 'N/A'}`]
    );

    res.json({ 
      success: true, 
      message: 'Queue called successfully',
      queue_data: {
        queue_number: wf.queue_number,
        client_name: wf.client_name,
        service_name: wf.service_name,
        counter_number
      }
    });
  } catch (error) {
    console.error('Error calling queue:', error);
    res.status(500).json({ success: false, message: 'Error calling queue' });
  }
});

// Get notifications for user
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { unread_only } = req.query;
    
    let query = `
      SELECT n.*, q.queue_number, q.client_name
      FROM notifications n
      LEFT JOIN queues q ON n.queue_id = q.id
      WHERE n.user_id = ?
    `;
    
    if (unread_only === 'true') {
      query += ' AND n.is_read = FALSE';
    }
    
    query += ' ORDER BY n.created_at DESC LIMIT 50';
    
    const [notifications] = await db.query(query, [user_id]);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    await db.query(
      'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
});

// Get workflow history
router.get('/history/:queue_id', authenticateToken, async (req, res) => {
  try {
    const { queue_id } = req.params;
    
    const query = `
      SELECT 
        wfh.*,
        u.full_name as performed_by_name,
        from_pk.full_name as from_pk_name,
        to_pk.full_name as to_pk_name
      FROM queue_workflow_history wfh
      LEFT JOIN users u ON wfh.performed_by = u.id
      LEFT JOIN users from_pk ON wfh.from_pk_id = from_pk.id
      LEFT JOIN users to_pk ON wfh.to_pk_id = to_pk.id
      WHERE wfh.queue_id = ?
      ORDER BY wfh.created_at ASC
    `;
    
    const [history] = await db.query(query, [queue_id]);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching workflow history:', error);
    res.status(500).json({ success: false, message: 'Error fetching history' });
  }
});

export default router;
