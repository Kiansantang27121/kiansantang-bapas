import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Fixing all issues...\n');

// 1. Fix Bimbingan Wajib Lapor requires_pk
console.log('1️⃣ Fixing Bimbingan Wajib Lapor requires_pk...');
try {
  const service = db.prepare("SELECT * FROM services WHERE name = 'Bimbingan Wajib Lapor'").get();
  if (service) {
    if (service.requires_pk === 0 || service.requires_pk === false) {
      db.prepare("UPDATE services SET requires_pk = 1 WHERE name = 'Bimbingan Wajib Lapor'").run();
      console.log('✅ Bimbingan Wajib Lapor requires_pk set to TRUE');
    } else {
      console.log('✅ Bimbingan Wajib Lapor requires_pk already TRUE');
    }
  } else {
    console.log('⚠️  Bimbingan Wajib Lapor service not found');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

// 2. Check rooms table
console.log('\n2️⃣ Checking rooms table...');
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='rooms'").all();
  if (tables.length === 0) {
    console.log('⚠️  Rooms table does not exist. Creating...');
    
    db.prepare(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_number TEXT NOT NULL UNIQUE,
        room_name TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    
    // Insert default rooms
    const defaultRooms = [
      { room_number: '1', room_name: 'Ruang 1' },
      { room_number: '2', room_name: 'Ruang 2' },
      { room_number: '3', room_name: 'Ruang 3' },
      { room_number: '4', room_name: 'Ruang 4' },
      { room_number: '5', room_name: 'Ruang 5' }
    ];
    
    const insertStmt = db.prepare('INSERT INTO rooms (room_number, room_name) VALUES (?, ?)');
    defaultRooms.forEach(room => {
      insertStmt.run(room.room_number, room.room_name);
    });
    
    console.log('✅ Rooms table created with 5 default rooms');
  } else {
    const rooms = db.prepare('SELECT * FROM rooms').all();
    console.log(`✅ Rooms table exists with ${rooms.length} rooms`);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

// 3. Verify queue table has all required columns
console.log('\n3️⃣ Verifying queue table columns...');
try {
  const columns = db.prepare('PRAGMA table_info(queue)').all();
  const columnNames = columns.map(c => c.name);
  
  const requiredColumns = [
    'pk_approved_at',
    'pk_called_at',
    'pk_entered_at',
    'client_called_at',
    'room_number'
  ];
  
  const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
  
  if (missingColumns.length > 0) {
    console.log(`⚠️  Missing columns: ${missingColumns.join(', ')}`);
    console.log('   Run add-room-columns-to-queue.js and add-pk-approved-column.js');
  } else {
    console.log('✅ All required columns exist');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

// 4. Verify PK table has jabatan column
console.log('\n4️⃣ Verifying PK table...');
try {
  const columns = db.prepare('PRAGMA table_info(pk)').all();
  const hasJabatan = columns.some(c => c.name === 'jabatan');
  
  if (!hasJabatan) {
    console.log('⚠️  PK table missing jabatan column');
    console.log('   Run add-jabatan-to-pk.js');
  } else {
    const pkWithJabatan = db.prepare('SELECT COUNT(*) as count FROM pk WHERE jabatan IS NOT NULL').get();
    const totalPK = db.prepare('SELECT COUNT(*) as count FROM pk').get();
    console.log(`✅ PK table has jabatan column (${pkWithJabatan.count}/${totalPK.count} PK have jabatan)`);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

// 5. Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));

const services = db.prepare('SELECT * FROM services').all();
const bwl = services.find(s => s.name === 'Bimbingan Wajib Lapor');
console.log(`\n✅ Services: ${services.length} total`);
console.log(`   - Bimbingan Wajib Lapor requires_pk: ${bwl?.requires_pk ? 'TRUE' : 'FALSE'}`);

const rooms = db.prepare('SELECT * FROM rooms').all();
console.log(`\n✅ Rooms: ${rooms.length} total`);

const pk = db.prepare('SELECT * FROM pk').all();
const pkWithJabatan = pk.filter(p => p.jabatan);
console.log(`\n✅ PK: ${pk.length} total`);
console.log(`   - With jabatan: ${pkWithJabatan.length}`);

const users = db.prepare('SELECT * FROM users').all();
console.log(`\n✅ Users: ${users.length} total`);
users.forEach(u => {
  console.log(`   - ${u.username} (${u.role})`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ All fixes applied!\n');

db.close();
