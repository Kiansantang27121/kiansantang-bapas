import db from './database.js';

console.log('🔄 RESET RUANGAN\n');
console.log('='.repeat(80));

try {
  // Get current room status
  console.log('\n📋 Status Ruangan Sebelum Reset:\n');
  
  const roomsBefore = db.prepare(`
    SELECT 
      room_number,
      is_available,
      current_pk_id,
      current_queue_id
    FROM rooms
    ORDER BY room_number
  `).all();
  
  roomsBefore.forEach(room => {
    const status = room.is_available ? '✅ Available' : '❌ Occupied';
    const pkInfo = room.current_pk_id ? `PK: ${room.current_pk_id}` : 'No PK';
    const queueInfo = room.current_queue_id ? `Queue: ${room.current_queue_id}` : 'No Queue';
    console.log(`  Ruang ${room.room_number}: ${status} | ${pkInfo} | ${queueInfo}`);
  });

  // Reset all rooms
  console.log('\n🔄 Mereset semua ruangan...\n');
  
  const result = db.prepare(`
    UPDATE rooms 
    SET 
      is_available = 1,
      current_pk_id = NULL,
      current_queue_id = NULL
  `).run();
  
  console.log(`✅ ${result.changes} ruangan direset`);

  // Verify
  console.log('\n📋 Status Ruangan Setelah Reset:\n');
  
  const roomsAfter = db.prepare(`
    SELECT 
      room_number,
      is_available,
      current_pk_id,
      current_queue_id
    FROM rooms
    ORDER BY room_number
  `).all();
  
  roomsAfter.forEach(room => {
    const status = room.is_available ? '✅ Available' : '❌ Occupied';
    const pkInfo = room.current_pk_id ? `PK: ${room.current_pk_id}` : 'No PK';
    const queueInfo = room.current_queue_id ? `Queue: ${room.current_queue_id}` : 'No Queue';
    console.log(`  Ruang ${room.room_number}: ${status} | ${pkInfo} | ${queueInfo}`);
  });

  // Also clear room assignments from queue table (optional)
  console.log('\n🔄 Membersihkan assignment ruangan di queue...\n');
  
  const queueUpdate = db.prepare(`
    UPDATE queue 
    SET 
      room_number = NULL,
      pk_called_at = NULL,
      pk_entered_at = NULL,
      client_called_at = NULL
    WHERE status = 'waiting'
    AND completed_at IS NULL
  `).run();
  
  console.log(`✅ ${queueUpdate.changes} queue direset`);

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ RESET RUANGAN SELESAI!\n');
  
  console.log('📊 Summary:');
  console.log(`  ✅ ${result.changes} ruangan tersedia`);
  console.log(`  ✅ Semua PK assignment dihapus`);
  console.log(`  ✅ Semua queue assignment dihapus`);
  console.log(`  ✅ ${queueUpdate.changes} queue direset`);
  
  console.log('\n💡 Catatan:');
  console.log('  - Semua ruangan sekarang available');
  console.log('  - PK bisa dipanggil ulang ke ruangan');
  console.log('  - Queue yang sedang berjalan direset');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
