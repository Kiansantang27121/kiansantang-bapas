import db from './database.js';

console.log('🔄 UPDATING SYSTEM: LOKET → RUANG PELAYANAN\n');
console.log('='.repeat(80));

// 1. Add room_number column if not exists
console.log('\n📋 Step 1: Checking queue table structure...\n');

const tableInfo = db.prepare("PRAGMA table_info(queue)").all();
const hasRoomNumber = tableInfo.some(col => col.name === 'room_number');
const hasPkCalledAt = tableInfo.some(col => col.name === 'pk_called_at');
const hasClientCalledAt = tableInfo.some(col => col.name === 'client_called_at');
const hasPkEnteredAt = tableInfo.some(col => col.name === 'pk_entered_at');

console.log('Current columns:', tableInfo.map(c => c.name).join(', '));

if (!hasRoomNumber || !hasPkCalledAt || !hasClientCalledAt || !hasPkEnteredAt) {
  console.log('\n⚠️  Missing columns detected. Need to recreate table...\n');
  
  // Get existing data
  const existingQueues = db.prepare('SELECT * FROM queue').all();
  console.log(`📦 Backing up ${existingQueues.length} existing queues...`);
  
  // Drop old table
  db.prepare('DROP TABLE IF EXISTS queue_backup').run();
  db.prepare('ALTER TABLE queue RENAME TO queue_backup').run();
  console.log('✅ Old table backed up');
  
  // Create new table with room system
  db.prepare(`
    CREATE TABLE queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_number TEXT UNIQUE NOT NULL,
      service_id INTEGER NOT NULL,
      client_name TEXT NOT NULL,
      client_phone TEXT,
      client_nik TEXT,
      pk_id INTEGER,
      client_id INTEGER,
      status TEXT DEFAULT 'waiting',
      room_number INTEGER,
      counter_number INTEGER,
      operator_id INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      called_at DATETIME,
      pk_called_at DATETIME,
      pk_entered_at DATETIME,
      client_called_at DATETIME,
      serving_at DATETIME,
      completed_at DATETIME,
      assigned_to_pk_id INTEGER,
      accepted_at DATETIME,
      rating INTEGER,
      rating_comment TEXT,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (pk_id) REFERENCES users(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `).run();
  console.log('✅ New table created with room system');
  
  // Restore data
  if (existingQueues.length > 0) {
    console.log('\n📥 Restoring data...');
    const insert = db.prepare(`
      INSERT INTO queue (
        id, queue_number, service_id, client_name, client_phone, client_nik,
        pk_id, client_id, status, counter_number, operator_id, notes,
        created_at, called_at, serving_at, completed_at,
        assigned_to_pk_id, accepted_at, rating, rating_comment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    existingQueues.forEach(q => {
      insert.run(
        q.id, q.queue_number, q.service_id, q.client_name, q.client_phone, q.client_nik,
        q.pk_id, q.client_id, q.status, q.counter_number, q.operator_id, q.notes,
        q.created_at, q.called_at, q.serving_at, q.completed_at,
        q.assigned_to_pk_id, q.accepted_at, q.rating, q.rating_comment
      );
    });
    console.log(`✅ Restored ${existingQueues.length} queues`);
  }
  
  // Drop backup
  db.prepare('DROP TABLE queue_backup').run();
  console.log('✅ Backup table removed');
} else {
  console.log('✅ All required columns exist');
}

// 2. Create rooms table
console.log('\n📋 Step 2: Creating rooms table...\n');

db.prepare('DROP TABLE IF EXISTS rooms').run();
db.prepare(`
  CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number INTEGER UNIQUE NOT NULL,
    room_name TEXT NOT NULL,
    is_available BOOLEAN DEFAULT 1,
    current_pk_id INTEGER,
    current_queue_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_pk_id) REFERENCES users(id),
    FOREIGN KEY (current_queue_id) REFERENCES queue(id)
  )
`).run();

console.log('✅ Rooms table created');

// 3. Insert default rooms
console.log('\n📋 Step 3: Creating default rooms...\n');

const rooms = [
  { number: 1, name: 'Ruang Pelayanan 1' },
  { number: 2, name: 'Ruang Pelayanan 2' },
  { number: 3, name: 'Ruang Pelayanan 3' },
  { number: 4, name: 'Ruang Pelayanan 4' },
  { number: 5, name: 'Ruang Pelayanan 5' }
];

rooms.forEach(room => {
  db.prepare('INSERT INTO rooms (room_number, room_name) VALUES (?, ?)').run(room.number, room.name);
  console.log(`✅ Created: ${room.name}`);
});

// 4. Verify
console.log('\n📋 Step 4: Verification...\n');

const queueCols = db.prepare("PRAGMA table_info(queue)").all();
console.log('Queue table columns:', queueCols.map(c => c.name).join(', '));

const roomsList = db.prepare('SELECT * FROM rooms').all();
console.log(`\n✅ Rooms created: ${roomsList.length}`);
roomsList.forEach(r => {
  console.log(`   - Room ${r.room_number}: ${r.room_name} (${r.is_available ? 'Available' : 'Occupied'})`);
});

const queueCount = db.prepare('SELECT COUNT(*) as count FROM queue').get();
console.log(`\n✅ Queues preserved: ${queueCount.count}`);

console.log('\n' + '='.repeat(80));
console.log('✅ SYSTEM UPDATED SUCCESSFULLY!\n');
console.log('Changes:');
console.log('  ✅ counter_number → room_number');
console.log('  ✅ Added pk_called_at (PK dipanggil masuk ruangan)');
console.log('  ✅ Added pk_entered_at (PK masuk ruangan)');
console.log('  ✅ Added client_called_at (Klien dipanggil masuk ruangan)');
console.log('  ✅ Created rooms table (5 ruang pelayanan)');
console.log('\nNew workflow:');
console.log('  1. Petugas assign antrian ke PK');
console.log('  2. PK approve antrian');
console.log('  3. Petugas panggil PK masuk ruangan → pk_called_at');
console.log('  4. PK masuk ruangan → pk_entered_at');
console.log('  5. Petugas panggil klien masuk ruangan → client_called_at');
console.log('  6. Klien masuk ruangan → serving_at');
console.log('  7. Selesai → completed_at');
