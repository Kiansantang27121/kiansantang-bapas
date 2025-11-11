import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all rooms
router.get('/', (req, res) => {
  try {
    const rooms = db.prepare('SELECT * FROM rooms WHERE is_active = 1 ORDER BY room_number').all();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create room
router.post('/', (req, res) => {
  try {
    const { room_number, room_name } = req.body;
    
    if (!room_number || !room_name) {
      return res.status(400).json({ error: 'Room number and name are required' });
    }
    
    const result = db.prepare('INSERT INTO rooms (room_number, room_name) VALUES (?, ?)').run(room_number, room_name);
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update room
router.put('/:id', (req, res) => {
  try {
    const { room_number, room_name, is_active } = req.body;
    
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    db.prepare('UPDATE rooms SET room_number = ?, room_name = ?, is_active = ? WHERE id = ?')
      .run(room_number || room.room_number, room_name || room.room_name, is_active !== undefined ? is_active : room.is_active, req.params.id);
    
    const updatedRoom = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete room (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    db.prepare('UPDATE rooms SET is_active = 0 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
