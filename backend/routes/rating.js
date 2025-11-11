import express from 'express';
import db from '../database.js';

const router = express.Router();

// Submit rating (public - no auth required, using queue_number as identifier)
router.post('/submit', (req, res) => {
  try {
    const { queue_number, rating, comment } = req.body;

    if (!queue_number || !rating) {
      return res.status(400).json({ error: 'Queue number and rating required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Find queue by queue_number
    const queue = db.prepare('SELECT * FROM queue WHERE queue_number = ?').get(queue_number);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    if (queue.status !== 'completed') {
      return res.status(400).json({ error: 'Can only rate completed services' });
    }

    if (queue.rating) {
      return res.status(400).json({ error: 'This service has already been rated' });
    }

    // Update queue with rating
    db.prepare(`
      UPDATE queue 
      SET rating = ?, rating_comment = ?
      WHERE id = ?
    `).run(rating, comment || null, queue.id);

    res.json({
      message: 'Thank you for your rating!',
      rating: {
        queue_number,
        rating,
        comment
      }
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Check if queue can be rated
router.get('/check/:queueNumber', (req, res) => {
  try {
    const { queueNumber } = req.params;

    const queue = db.prepare(`
      SELECT id, queue_number, status, rating, 
             completed_at,
             (SELECT name FROM services WHERE id = queue.service_id) as service_name,
             (SELECT name FROM pk WHERE id = queue.assigned_to_pk_id) as pk_name
      FROM queue 
      WHERE queue_number = ?
    `).get(queueNumber);

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found' });
    }

    const canRate = queue.status === 'completed' && !queue.rating;

    res.json({
      canRate,
      queue: {
        queue_number: queue.queue_number,
        status: queue.status,
        hasRating: !!queue.rating,
        service_name: queue.service_name,
        pk_name: queue.pk_name,
        completed_at: queue.completed_at
      }
    });
  } catch (error) {
    console.error('Error checking rating:', error);
    res.status(500).json({ error: 'Failed to check rating status' });
  }
});

// Get rating statistics (for admin/operator)
router.get('/statistics', (req, res) => {
  try {
    const { pk_id, date_from, date_to } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1
      FROM queue
      WHERE rating IS NOT NULL
    `;

    const params = [];

    if (pk_id) {
      query += ' AND assigned_to_pk_id = ?';
      params.push(pk_id);
    }

    if (date_from) {
      query += ' AND DATE(completed_at) >= ?';
      params.push(date_from);
    }

    if (date_to) {
      query += ' AND DATE(completed_at) <= ?';
      params.push(date_to);
    }

    const stats = db.prepare(query).get(...params);

    // Get recent comments
    let commentsQuery = `
      SELECT q.rating, q.rating_comment, q.completed_at,
             s.name as service_name,
             p.name as pk_name
      FROM queue q
      JOIN services s ON q.service_id = s.id
      LEFT JOIN pk p ON q.assigned_to_pk_id = p.id
      WHERE q.rating_comment IS NOT NULL
    `;

    const commentParams = [];

    if (pk_id) {
      commentsQuery += ' AND q.assigned_to_pk_id = ?';
      commentParams.push(pk_id);
    }

    if (date_from) {
      commentsQuery += ' AND DATE(q.completed_at) >= ?';
      commentParams.push(date_from);
    }

    if (date_to) {
      commentsQuery += ' AND DATE(q.completed_at) <= ?';
      commentParams.push(date_to);
    }

    commentsQuery += ' ORDER BY q.completed_at DESC LIMIT 10';

    const recentComments = db.prepare(commentsQuery).all(...commentParams);

    res.json({
      statistics: stats,
      recentComments
    });
  } catch (error) {
    console.error('Error fetching rating statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get ratings by PK
router.get('/by-pk', (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    let query = `
      SELECT 
        p.id,
        p.name as pk_name,
        COUNT(q.id) as total_services,
        COUNT(q.rating) as total_ratings,
        AVG(q.rating) as average_rating,
        SUM(CASE WHEN q.rating = 5 THEN 1 ELSE 0 END) as rating_5,
        SUM(CASE WHEN q.rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN q.rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN q.rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN q.rating = 1 THEN 1 ELSE 0 END) as rating_1
      FROM pk p
      LEFT JOIN queue q ON p.id = q.assigned_to_pk_id AND q.status = 'completed'
    `;

    const params = [];

    if (date_from || date_to) {
      query += ' WHERE 1=1';
      
      if (date_from) {
        query += ' AND DATE(q.completed_at) >= ?';
        params.push(date_from);
      }

      if (date_to) {
        query += ' AND DATE(q.completed_at) <= ?';
        params.push(date_to);
      }
    }

    query += ' GROUP BY p.id, p.name ORDER BY average_rating DESC';

    const pkRatings = db.prepare(query).all(...params);

    res.json(pkRatings);
  } catch (error) {
    console.error('Error fetching PK ratings:', error);
    res.status(500).json({ error: 'Failed to fetch PK ratings' });
  }
});

export default router;
