import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all active clients
router.get('/', (req, res) => {
  try {
    const { pk_id } = req.query;
    
    let query = `
      SELECT c.*, p.name as pk_name 
      FROM clients c 
      LEFT JOIN pk p ON c.pk_id = p.id 
      WHERE c.is_active = 1
    `;
    
    const params = [];
    
    if (pk_id) {
      query += ' AND c.pk_id = ?';
      params.push(pk_id);
    }
    
    query += ' ORDER BY c.name';
    
    const clients = db.prepare(query).all(...params);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get client by ID
router.get('/:id', (req, res) => {
  try {
    const client = db.prepare(`
      SELECT c.*, p.name as pk_name 
      FROM clients c 
      LEFT JOIN pk p ON c.pk_id = p.id 
      WHERE c.id = ?
    `).get(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/', (req, res) => {
  try {
    const { name, nik, phone, whatsapp, address, pk_id, program, is_working, job } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (!program) {
      return res.status(400).json({ error: 'Program is required' });
    }

    const result = db.prepare(`
      INSERT INTO clients (name, nik, phone, whatsapp, address, pk_id, program, is_working, job) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      nik || null,
      phone || null,
      whatsapp || null,
      address || null,
      pk_id || null,
      program,
      is_working ? 1 : 0,
      job || null
    );

    const newClient = db.prepare(`
      SELECT c.*, p.name as pk_name 
      FROM clients c 
      LEFT JOIN pk p ON c.pk_id = p.id 
      WHERE c.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', (req, res) => {
  try {
    const { name, nik, phone, whatsapp, address, pk_id, program, is_working, job, is_active } = req.body;
    
    db.prepare(`
      UPDATE clients 
      SET name = ?, nik = ?, phone = ?, whatsapp = ?, address = ?, pk_id = ?, 
          program = ?, is_working = ?, job = ?, is_active = ? 
      WHERE id = ?
    `).run(
      name,
      nik || null,
      phone || null,
      whatsapp || null,
      address || null,
      pk_id || null,
      program,
      is_working ? 1 : 0,
      job || null,
      is_active !== undefined ? is_active : 1,
      req.params.id
    );

    const updatedClient = db.prepare(`
      SELECT c.*, p.name as pk_name 
      FROM clients c 
      LEFT JOIN pk p ON c.pk_id = p.id 
      WHERE c.id = ?
    `).get(req.params.id);
    
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client (soft delete)
router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE clients SET is_active = 0 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
