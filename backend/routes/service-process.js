import express from 'express';
import db from '../database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get active service for PK
router.get('/active-service', authenticateToken, requireRole(['pk']), (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get pk.id from pk table using user_id mapping
    const pkRecord = db.prepare('SELECT id FROM pk WHERE user_id = ?').get(user_id);
    
    if (!pkRecord) {
      return res.json({ success: true, queue: null });
    }
    
    const pk_id = pkRecord.id;
    
    // Get active queue (client called but not completed)
    const queue = db.prepare(`
      SELECT 
        q.*,
        s.name as service_name,
        pk.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk ON q.pk_id = pk.id
      WHERE q.pk_id = ?
      AND q.client_called_at IS NOT NULL
      AND q.completed_at IS NULL
      ORDER BY q.client_called_at DESC
      LIMIT 1
    `).get(pk_id);
    
    res.json({ success: true, queue });
  } catch (error) {
    console.error('Error fetching active service:', error);
    res.status(500).json({ success: false, message: 'Error fetching active service' });
  }
});

// Save service progress
router.post('/save-service-progress', authenticateToken, requireRole(['pk']), (req, res) => {
  try {
    const { queue_id, service_data, current_step } = req.body;
    const user_id = req.user.id;
    
    // Get pk.id
    const pkRecord = db.prepare('SELECT id FROM pk WHERE user_id = ?').get(user_id);
    
    if (!pkRecord) {
      return res.status(404).json({ success: false, message: 'PK record not found' });
    }
    
    // Verify queue belongs to this PK
    const queue = db.prepare('SELECT * FROM queue WHERE id = ? AND pk_id = ?').get(queue_id, pkRecord.id);
    
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found or not assigned to you' });
    }
    
    // Update queue with service data
    db.prepare(`
      UPDATE queue 
      SET service_data = ?, service_step = ?
      WHERE id = ?
    `).run(service_data, current_step, queue_id);
    
    console.log(`💾 Service progress saved for queue ${queue.queue_number} (step ${current_step})`);
    
    res.json({ success: true, message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error saving service progress:', error);
    res.status(500).json({ success: false, message: 'Error saving progress' });
  }
});

// Complete service
router.post('/complete-service', authenticateToken, requireRole(['pk']), (req, res) => {
  try {
    const { queue_id, service_data } = req.body;
    const user_id = req.user.id;
    
    // Get pk.id
    const pkRecord = db.prepare('SELECT id, name FROM pk WHERE user_id = ?').get(user_id);
    
    if (!pkRecord) {
      return res.status(404).json({ success: false, message: 'PK record not found' });
    }
    
    // Verify queue belongs to this PK
    const queue = db.prepare(`
      SELECT q.*, c.name as client_name, c.nik as client_nik
      FROM queue q
      LEFT JOIN clients c ON q.client_nik = c.nik
      WHERE q.id = ? AND q.pk_id = ?
    `).get(queue_id, pkRecord.id);
    
    if (!queue) {
      return res.status(404).json({ success: false, message: 'Queue not found or not assigned to you' });
    }
    
    const serviceDataStr = JSON.stringify(service_data);
    const completedAt = new Date().toISOString();
    
    // Update queue as completed
    db.prepare(`
      UPDATE queue 
      SET 
        service_data = ?,
        completed_at = ?,
        status = 'completed'
      WHERE id = ?
    `).run(serviceDataStr, completedAt, queue_id);
    
    // Save to service_reports table
    db.prepare(`
      INSERT INTO service_reports (
        queue_id,
        queue_number,
        client_nik,
        client_name,
        pk_id,
        pk_name,
        service_date,
        room_number,
        question1,
        question2,
        question3,
        question4,
        question5,
        photos_count,
        notes,
        satisfaction,
        feedback,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      queue_id,
      queue.queue_number,
      queue.client_nik,
      queue.client_name || 'Unknown',
      pkRecord.id,
      pkRecord.name,
      new Date().toISOString().split('T')[0],
      queue.room_number,
      service_data.question1,
      service_data.question2,
      service_data.question3,
      service_data.question4,
      service_data.question5,
      service_data.photos.length,
      service_data.notes || '',
      service_data.satisfaction,
      service_data.feedback || '',
      completedAt
    );
    
    // Save photos to service_photos table
    service_data.photos.forEach((photo, index) => {
      db.prepare(`
        INSERT INTO service_photos (
          queue_id,
          photo_data,
          photo_order,
          created_at
        ) VALUES (?, ?, ?, ?)
      `).run(queue_id, photo.data, index + 1, photo.timestamp);
    });
    
    // Update client's last service date
    if (queue.client_nik) {
      db.prepare(`
        UPDATE clients 
        SET last_service_date = ?
        WHERE nik = ?
      `).run(completedAt, queue.client_nik);
    }
    
    // Release room
    db.prepare(`
      UPDATE rooms 
      SET is_available = 1, current_pk_id = NULL, current_queue_id = NULL
      WHERE room_number = ?
    `).run(queue.room_number);
    
    console.log(`✅ Service completed for queue ${queue.queue_number} by PK ${pkRecord.name}`);
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:completed', {
        queue_id,
        queue_number: queue.queue_number,
        satisfaction: service_data.satisfaction
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Service completed successfully',
      report_id: db.prepare('SELECT last_insert_rowid() as id').get().id
    });
  } catch (error) {
    console.error('Error completing service:', error);
    res.status(500).json({ success: false, message: 'Error completing service', error: error.message });
  }
});

// Get daily report for PK
router.get('/daily-report', authenticateToken, requireRole(['pk', 'admin']), (req, res) => {
  try {
    const { date } = req.query;
    const user_id = req.user.id;
    const role = req.user.role;
    
    let pk_id = null;
    
    if (role === 'pk') {
      const pkRecord = db.prepare('SELECT id FROM pk WHERE user_id = ?').get(user_id);
      if (!pkRecord) {
        return res.json({ success: true, reports: [] });
      }
      pk_id = pkRecord.id;
    }
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    let query = `
      SELECT 
        sr.*,
        (SELECT COUNT(*) FROM service_photos WHERE queue_id = sr.queue_id) as photos_count
      FROM service_reports sr
      WHERE DATE(sr.service_date) = DATE(?)
    `;
    
    const params = [targetDate];
    
    if (pk_id) {
      query += ' AND sr.pk_id = ?';
      params.push(pk_id);
    }
    
    query += ' ORDER BY sr.created_at DESC';
    
    const reports = db.prepare(query).all(...params);
    
    // Calculate statistics
    const stats = {
      total: reports.length,
      satisfied: reports.filter(r => r.satisfaction === 3).length,
      neutral: reports.filter(r => r.satisfaction === 2).length,
      unsatisfied: reports.filter(r => r.satisfaction === 1).length,
      avg_satisfaction: reports.length > 0 
        ? (reports.reduce((sum, r) => sum + r.satisfaction, 0) / reports.length).toFixed(2)
        : 0
    };
    
    res.json({ success: true, reports, stats, date: targetDate });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    res.status(500).json({ success: false, message: 'Error fetching daily report' });
  }
});

// Get service report detail
router.get('/report/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    const report = db.prepare(`
      SELECT sr.*
      FROM service_reports sr
      WHERE sr.id = ?
    `).get(id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    // Get photos
    const photos = db.prepare(`
      SELECT * FROM service_photos 
      WHERE queue_id = ?
      ORDER BY photo_order
    `).all(report.queue_id);
    
    res.json({ success: true, report, photos });
  } catch (error) {
    console.error('Error fetching report detail:', error);
    res.status(500).json({ success: false, message: 'Error fetching report detail' });
  }
});

// Get client service history
router.get('/client-history/:nik', authenticateToken, (req, res) => {
  try {
    const { nik } = req.params;
    
    const history = db.prepare(`
      SELECT 
        sr.*,
        (SELECT COUNT(*) FROM service_photos WHERE queue_id = sr.queue_id) as photos_count
      FROM service_reports sr
      WHERE sr.client_nik = ?
      ORDER BY sr.service_date DESC
    `).all(nik);
    
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching client history:', error);
    res.status(500).json({ success: false, message: 'Error fetching client history' });
  }
});

export default router;
