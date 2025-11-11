import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all active PK
router.get('/', (req, res) => {
  try {
    // Get PK from pk table (has complete info: NIP, jabatan, phone)
    const pkTable = db.prepare('SELECT * FROM pk WHERE is_active = 1 ORDER BY name').all();
    
    // Also get PK users from users table for workflow
    const pkUsers = db.prepare("SELECT id, username, name, role FROM users WHERE role = 'pk' ORDER BY name").all();
    
    console.log(`📋 Fetching PK list: ${pkTable.length} from pk table, ${pkUsers.length} from users table`);
    
    // Return pk table data (for registration with complete info)
    // But also include users for workflow compatibility
    res.json({ 
      pks: pkTable.length > 0 ? pkTable : pkUsers, // Prefer pk table if available
      pk_users: pkUsers // for workflow
    });
  } catch (error) {
    console.error('Error fetching PK:', error);
    res.status(500).json({ error: 'Failed to fetch PK' });
  }
});

// Get PK by ID
router.get('/:id', (req, res) => {
  try {
    const pk = db.prepare('SELECT * FROM pk WHERE id = ?').get(req.params.id);
    if (!pk) {
      return res.status(404).json({ error: 'PK not found' });
    }
    res.json(pk);
  } catch (error) {
    console.error('Error fetching PK:', error);
    res.status(500).json({ error: 'Failed to fetch PK' });
  }
});

// Get clients by PK ID
router.get('/:id/clients', (req, res) => {
  try {
    const clients = db.prepare('SELECT * FROM clients WHERE pk_id = ? AND is_active = 1 ORDER BY name').all(req.params.id);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create new PK (admin only)
router.post('/', (req, res) => {
  try {
    const { name, nip, phone, jabatan } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = db.prepare('INSERT INTO pk (name, nip, phone, jabatan) VALUES (?, ?, ?, ?)').run(
      name,
      nip || null,
      phone || null,
      jabatan || null
    );

    const newPK = db.prepare('SELECT * FROM pk WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newPK);
  } catch (error) {
    console.error('Error creating PK:', error);
    res.status(500).json({ error: 'Failed to create PK' });
  }
});

// Update PK (admin only)
router.put('/:id', (req, res) => {
  try {
    const { name, nip, phone, jabatan, is_active } = req.body;
    
    db.prepare('UPDATE pk SET name = ?, nip = ?, phone = ?, jabatan = ?, is_active = ? WHERE id = ?').run(
      name,
      nip || null,
      phone || null,
      jabatan || null,
      is_active !== undefined ? is_active : 1,
      req.params.id
    );

    const updatedPK = db.prepare('SELECT * FROM pk WHERE id = ?').get(req.params.id);
    res.json(updatedPK);
  } catch (error) {
    console.error('Error updating PK:', error);
    res.status(500).json({ error: 'Failed to update PK' });
  }
});

// Delete PK (soft delete - admin only)
router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE pk SET is_active = 0 WHERE id = ?').run(req.params.id);
    res.json({ message: 'PK deleted successfully' });
  } catch (error) {
    console.error('Error deleting PK:', error);
    res.status(500).json({ error: 'Failed to delete PK' });
  }
});

export default router;
