import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🏢 Creating rooms table...\n');

try {
  // Create rooms table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT UNIQUE NOT NULL,
      room_name TEXT NOT NULL,
      is_available BOOLEAN DEFAULT 1,
      current_pk_id INTEGER,
      current_queue_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (current_pk_id) REFERENCES pk(id),
      FOREIGN KEY (current_queue_id) REFERENCES queue(id)
    )
  `);
  
  console.log('✅ Rooms table created');
  
  // Check if rooms exist
  const roomCount = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  
  if (roomCount.count === 0) {
    console.log('\n📝 Inserting default rooms...');
    
    const insertRoom = db.prepare(`
      INSERT INTO rooms (room_number, room_name, is_available)
      VALUES (?, ?, 1)
    `);
    
    insertRoom.run('1', 'Ruang 1');
    insertRoom.run('2', 'Ruang 2');
    insertRoom.run('3', 'Ruang 3');
    insertRoom.run('4', 'Ruang 4');
    insertRoom.run('5', 'Ruang 5');
    
    console.log('✅ Inserted 5 default rooms');
  } else {
    console.log(`\n✅ Rooms already exist: ${roomCount.count} rooms`);
  }
  
  // Display all rooms
  console.log('\n📊 Current rooms:');
  console.log('═══════════════════════════════════════════════════════════');
  
  const rooms = db.prepare('SELECT * FROM rooms ORDER BY room_number').all();
  
  rooms.forEach(room => {
    const status = room.is_available ? '✅ Available' : '🔒 Occupied';
    console.log(`${room.room_number}. ${room.room_name.padEnd(20)} | ${status}`);
  });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Total rooms: ${rooms.length}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
console.log('\n✅ Done!');
