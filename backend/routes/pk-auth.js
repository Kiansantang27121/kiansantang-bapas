import express from 'express';
import db from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get available PK list by jenjang (after login with shared account)
router.get('/available-pk', authenticateToken, (req, res) => {
  try {
    const { jenjang } = req.user;
    
    if (!jenjang) {
      return res.status(400).json({ 
        success: false, 
        message: 'Jenjang not found in user profile' 
      });
    }
    
    // Get all PK with matching jenjang
    const pkList = db.prepare(`
      SELECT 
        id,
        name,
        nip,
        jenjang,
        position
      FROM pk
      WHERE jenjang = ?
      AND is_active = 1
      ORDER BY name
    `).all(jenjang);
    
    res.json({
      success: true,
      jenjang,
      pk_list: pkList
    });
  } catch (error) {
    console.error('Error fetching PK list:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching PK list' 
    });
  }
});

// Select PK (create session)
router.post('/select-pk', authenticateToken, (req, res) => {
  try {
    const { pk_id } = req.body;
    const user_id = req.user.id;
    
    if (!pk_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'PK ID is required' 
      });
    }
    
    // Get PK details
    const pk = db.prepare(`
      SELECT id, name, nip, jenjang, position
      FROM pk
      WHERE id = ?
    `).get(pk_id);
    
    if (!pk) {
      return res.status(404).json({ 
        success: false, 
        message: 'PK not found' 
      });
    }
    
    // Verify jenjang matches
    if (pk.jenjang !== req.user.jenjang) {
      return res.status(403).json({ 
        success: false, 
        message: 'PK jenjang does not match your account' 
      });
    }
    
    // Deactivate previous sessions for this user
    db.prepare(`
      UPDATE pk_sessions 
      SET is_active = 0, logout_time = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_active = 1
    `).run(user_id);
    
    // Create new session
    const result = db.prepare(`
      INSERT INTO pk_sessions (user_id, pk_id, pk_name, jenjang)
      VALUES (?, ?, ?, ?)
    `).run(user_id, pk.id, pk.name, pk.jenjang);
    
    const session_id = result.lastInsertRowid;
    
    console.log(`✅ PK Session created: ${req.user.username} → ${pk.name}`);
    
    res.json({
      success: true,
      message: 'PK selected successfully',
      session: {
        session_id,
        user_id,
        pk_id: pk.id,
        pk_name: pk.name,
        pk_nip: pk.nip,
        jenjang: pk.jenjang,
        position: pk.position,
        logged_in_as: req.user.username
      }
    });
  } catch (error) {
    console.error('Error selecting PK:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error selecting PK',
      error: error.message 
    });
  }
});

// Get current session
router.get('/current-session', authenticateToken, (req, res) => {
  try {
    const user_id = req.user.id;
    
    const session = db.prepare(`
      SELECT 
        ps.*,
        pk.nip,
        pk.position
      FROM pk_sessions ps
      JOIN pk ON ps.pk_id = pk.id
      WHERE ps.user_id = ? 
      AND ps.is_active = 1
      ORDER BY ps.login_time DESC
      LIMIT 1
    `).get(user_id);
    
    if (!session) {
      return res.json({
        success: true,
        has_session: false,
        requires_pk_selection: true
      });
    }
    
    res.json({
      success: true,
      has_session: true,
      session: {
        session_id: session.id,
        user_id: session.user_id,
        pk_id: session.pk_id,
        pk_name: session.pk_name,
        pk_nip: session.nip,
        jenjang: session.jenjang,
        position: session.position,
        logged_in_as: req.user.username,
        login_time: session.login_time
      }
    });
  } catch (error) {
    console.error('Error fetching current session:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching current session' 
    });
  }
});

// Logout (deactivate session)
router.post('/logout-session', authenticateToken, (req, res) => {
  try {
    const user_id = req.user.id;
    
    db.prepare(`
      UPDATE pk_sessions 
      SET is_active = 0, logout_time = CURRENT_TIMESTAMP
      WHERE user_id = ? AND is_active = 1
    `).run(user_id);
    
    res.json({
      success: true,
      message: 'Session logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out session:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging out session' 
    });
  }
});

// Get session history
router.get('/session-history', authenticateToken, (req, res) => {
  try {
    const user_id = req.user.id;
    const { limit = 10 } = req.query;
    
    const history = db.prepare(`
      SELECT 
        ps.*,
        pk.nip,
        pk.position
      FROM pk_sessions ps
      JOIN pk ON ps.pk_id = pk.id
      WHERE ps.user_id = ?
      ORDER BY ps.login_time DESC
      LIMIT ?
    `).all(user_id, parseInt(limit));
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching session history' 
    });
  }
});

export default router;
