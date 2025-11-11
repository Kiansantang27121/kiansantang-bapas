import db from './database.js';

console.log('🗑️  Deleting ALL PK Data (Hard Delete)...\n');

try {
  const beforePK = db.prepare('SELECT COUNT(*) as count FROM pk').get();
  const beforeClients = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  
  console.log(`PK sebelum dihapus: ${beforePK.count}`);
  console.log(`Clients sebelum dihapus: ${beforeClients.count}`);
  console.log('');
  
  // Disable foreign key constraints temporarily
  db.prepare('PRAGMA foreign_keys = OFF').run();
  
  // Delete clients first
  const clientsResult = db.prepare('DELETE FROM clients').run();
  console.log(`✅ Deleted ${clientsResult.changes} Clients records`);
  
  // Then delete PK
  const pkResult = db.prepare('DELETE FROM pk').run();
  console.log(`✅ Deleted ${pkResult.changes} PK records`);
  
  // Re-enable foreign key constraints
  db.prepare('PRAGMA foreign_keys = ON').run();
  
  const afterPK = db.prepare('SELECT COUNT(*) as count FROM pk').get();
  const afterClients = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  
  console.log('');
  console.log(`PK setelah dihapus: ${afterPK.count}`);
  console.log(`Clients setelah dihapus: ${afterClients.count}`);
  
  console.log('\n✅ Done! Database PK dan Clients sudah kosong.');
  console.log('📝 Sekarang sync ulang dari Google Sheets untuk memasukkan semua 63 PK.');
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
