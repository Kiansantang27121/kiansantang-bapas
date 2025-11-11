import express from 'express';
import db from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all settings (public)
router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get setting by key
router.get('/:key', (req, res) => {
  try {
    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update setting (admin only)
router.put('/:key', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { value, description } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value required' });
    }

    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);

    if (setting) {
      db.prepare(
        'UPDATE settings SET value = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
      ).run(value, description || setting.description, req.params.key);
    } else {
      db.prepare(
        'INSERT INTO settings (key, value, description) VALUES (?, ?, ?)'
      ).run(req.params.key, value, description);
    }

    const updated = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);
    res.json(updated);
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Bulk update settings (admin only)
router.post('/bulk', authenticateToken, requireAdmin, (req, res) => {
  try {
    const settings = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object required' });
    }

    const updateStmt = db.prepare(
      'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?'
    );
    const insertStmt = db.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?)'
    );

    Object.entries(settings).forEach(([key, value]) => {
      const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get(key);
      if (existing) {
        updateStmt.run(value, key);
      } else {
        insertStmt.run(key, value);
      }
    });

    const allSettings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    allSettings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Delete setting (admin only)
router.delete('/:key', authenticateToken, requireAdmin, (req, res) => {
  try {
    const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    db.prepare('DELETE FROM settings WHERE key = ?').run(req.params.key);
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

export default router;
