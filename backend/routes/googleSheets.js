import express from 'express';
import axios from 'axios';
import db from '../database.js';

const router = express.Router();

// Sync PK from Google Sheets
router.post('/sync-pk', async (req, res) => {
  try {
    const { sheetUrl } = req.body;
    
    if (!sheetUrl) {
      return res.status(400).json({ error: 'Google Sheets URL is required' });
    }

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return res.status(400).json({ error: 'Invalid Google Sheets URL' });
    }

    const sheetId = sheetIdMatch[1];
    
    // Convert to CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    console.log('Fetching data from Google Sheets:', csvUrl);
    
    // Fetch CSV data
    const response = await axios.get(csvUrl);
    const csvData = response.data;
    
    // Parse CSV with proper handling of quoted values
    const parseCSVLine = (line) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    };
    
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    console.log('Headers:', headers);
    
    // Expected headers: Nama, NIP, Telepon, Jabatan
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama'));
    const nipIndex = headers.findIndex(h => h.toLowerCase().includes('nip'));
    const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('telepon') || h.toLowerCase().includes('phone'));
    const jabatanIndex = headers.findIndex(h => h.toLowerCase().includes('jabatan'));
    
    if (nameIndex === -1) {
      return res.status(400).json({ 
        error: 'Column "Nama" not found in Google Sheets. Please ensure your sheet has columns: Nama, NIP, Telepon, Jabatan' 
      });
    }
    
    let synced = 0;
    let updated = 0;
    let errors = 0;
    
    // Process each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        console.log(`Skipping row ${i + 1}: Empty line`);
        continue;
      }
      
      const values = parseCSVLine(line);
      console.log(`Row ${i + 1}: Parsed ${values.length} values`);
      
      const name = values[nameIndex] || '';
      const nip = nipIndex !== -1 ? values[nipIndex] : '';
      const phone = phoneIndex !== -1 ? values[phoneIndex] : '';
      const jabatan = jabatanIndex !== -1 ? values[jabatanIndex] : '';
      
      if (!name) {
        console.log(`Skipping row ${i + 1}: No name (values: ${JSON.stringify(values)})`);
        continue;
      }
      
      console.log(`Processing row ${i + 1}: ${name} | NIP: ${nip} | Phone: ${phone} | Jabatan: ${jabatan}`);
      
      try {
        // Check if PK already exists by NIP or name
        let existingPK = null;
        if (nip) {
          existingPK = db.prepare('SELECT * FROM pk WHERE nip = ?').get(nip);
        }
        if (!existingPK) {
          existingPK = db.prepare('SELECT * FROM pk WHERE name = ?').get(name);
        }
        
        if (existingPK) {
          // Update existing PK (set is_active = 1)
          db.prepare('UPDATE pk SET name = ?, nip = ?, phone = ?, jabatan = ?, is_active = 1 WHERE id = ?').run(
            name,
            nip || null,
            phone || null,
            jabatan || null,
            existingPK.id
          );
          updated++;
          console.log(`Updated PK: ${name}`);
        } else {
          // Insert new PK (with is_active = 1)
          db.prepare('INSERT INTO pk (name, nip, phone, jabatan, is_active) VALUES (?, ?, ?, ?, 1)').run(
            name,
            nip || null,
            phone || null,
            jabatan || null
          );
          synced++;
          console.log(`Added new PK: ${name}`);
        }
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        errors++;
      }
    }
    
    // Save Google Sheets URL to settings
    const existingSetting = db.prepare('SELECT * FROM settings WHERE key = ?').get('google_sheets_pk_url');
    if (existingSetting) {
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(sheetUrl, 'google_sheets_pk_url');
    } else {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('google_sheets_pk_url', sheetUrl);
    }
    
    res.json({
      success: true,
      message: `Sync completed: ${synced} new PK added, ${updated} PK updated, ${errors} errors`,
      synced,
      updated,
      errors
    });
    
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    
    if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'Access denied. Please make sure the Google Sheet is set to "Anyone with the link can view"' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to sync from Google Sheets',
      details: error.message 
    });
  }
});

// Get current Google Sheets URL
router.get('/pk-sheet-url', (req, res) => {
  try {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('google_sheets_pk_url');
    res.json({ url: setting?.value || '' });
  } catch (error) {
    console.error('Error fetching sheet URL:', error);
    res.status(500).json({ error: 'Failed to fetch sheet URL' });
  }
});

// Sync Clients from Google Sheets (per PK)
router.post('/sync-clients', async (req, res) => {
  try {
    const { sheetUrl, pkId } = req.body;
    
    if (!sheetUrl) {
      return res.status(400).json({ error: 'Google Sheets URL is required' });
    }
    
    if (!pkId) {
      return res.status(400).json({ error: 'PK ID is required' });
    }

    // Verify PK exists
    const pk = db.prepare('SELECT * FROM pk WHERE id = ?').get(pkId);
    if (!pk) {
      return res.status(404).json({ error: 'PK not found' });
    }

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      return res.status(400).json({ error: 'Invalid Google Sheets URL' });
    }

    const sheetId = sheetIdMatch[1];
    
    // Extract gid (sheet tab ID) if present
    const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    
    // Convert to CSV export URL with specific sheet
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    console.log('Fetching clients data from Google Sheets:', csvUrl);
    
    // Fetch CSV data
    const response = await axios.get(csvUrl);
    const csvData = response.data;
    
    // Parse CSV with proper handling of quoted values
    const parseCSVLine = (line) => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    };
    
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    console.log('Headers:', headers);
    
    // Expected headers: Nama, NIK, Telepon, Alamat
    const nameIndex = headers.findIndex(h => h.toLowerCase().includes('nama'));
    const nikIndex = headers.findIndex(h => h.toLowerCase().includes('nik'));
    const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('telepon') || h.toLowerCase().includes('phone'));
    const addressIndex = headers.findIndex(h => h.toLowerCase().includes('alamat') || h.toLowerCase().includes('address'));
    
    if (nameIndex === -1) {
      return res.status(400).json({ 
        error: 'Column "Nama" not found in Google Sheets. Please ensure your sheet has columns: Nama, NIK, Telepon, Alamat' 
      });
    }
    
    let synced = 0;
    let updated = 0;
    let errors = 0;
    
    // Process each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      
      const name = values[nameIndex] || '';
      const nik = nikIndex !== -1 ? values[nikIndex] : '';
      const phone = phoneIndex !== -1 ? values[phoneIndex] : '';
      const address = addressIndex !== -1 ? values[addressIndex] : '';
      
      if (!name) {
        console.log(`Skipping row ${i + 1}: No name`);
        continue;
      }
      
      try {
        // Check if client already exists by NIK or name for this PK
        let existingClient = null;
        if (nik) {
          existingClient = db.prepare('SELECT * FROM clients WHERE nik = ? AND pk_id = ?').get(nik, pkId);
        }
        if (!existingClient) {
          existingClient = db.prepare('SELECT * FROM clients WHERE name = ? AND pk_id = ?').get(name, pkId);
        }
        
        if (existingClient) {
          // Update existing client (set is_active = 1)
          db.prepare('UPDATE clients SET name = ?, nik = ?, phone = ?, address = ?, is_active = 1 WHERE id = ?').run(
            name,
            nik || null,
            phone || null,
            address || null,
            existingClient.id
          );
          updated++;
          console.log(`Updated client: ${name} for PK ${pk.name}`);
        } else {
          // Insert new client (with is_active = 1)
          db.prepare('INSERT INTO clients (pk_id, name, nik, phone, address, is_active) VALUES (?, ?, ?, ?, ?, 1)').run(
            pkId,
            name,
            nik || null,
            phone || null,
            address || null
          );
          synced++;
          console.log(`Added new client: ${name} for PK ${pk.name}`);
        }
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
        errors++;
      }
    }
    
    // Save Google Sheets URL to settings with PK ID
    const settingKey = `google_sheets_clients_pk_${pkId}`;
    const existingSetting = db.prepare('SELECT * FROM settings WHERE key = ?').get(settingKey);
    if (existingSetting) {
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(sheetUrl, settingKey);
    } else {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(settingKey, sheetUrl);
    }
    
    res.json({
      success: true,
      message: `Sync completed for ${pk.name}: ${synced} new clients added, ${updated} clients updated, ${errors} errors`,
      pkName: pk.name,
      synced,
      updated,
      errors
    });
    
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    
    if (error.response?.status === 403) {
      return res.status(403).json({ 
        error: 'Access denied. Please make sure the Google Sheet is set to "Anyone with the link can view"' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to sync from Google Sheets',
      details: error.message 
    });
  }
});

// Get Google Sheets URL for specific PK's clients
router.get('/clients-sheet-url/:pkId', (req, res) => {
  try {
    const settingKey = `google_sheets_clients_pk_${req.params.pkId}`;
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(settingKey);
    res.json({ url: setting?.value || '' });
  } catch (error) {
    console.error('Error fetching sheet URL:', error);
    res.status(500).json({ error: 'Failed to fetch sheet URL' });
  }
});

// Get all PK with their Google Sheets URLs
router.get('/all-pk-sheets', (req, res) => {
  try {
    const pkList = db.prepare('SELECT * FROM pk WHERE is_active = 1').all();
    const result = pkList.map(pk => {
      const settingKey = `google_sheets_clients_pk_${pk.id}`;
      const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(settingKey);
      return {
        ...pk,
        clientsSheetUrl: setting?.value || ''
      };
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching PK sheets:', error);
    res.status(500).json({ error: 'Failed to fetch PK sheets' });
  }
});

export default router;
