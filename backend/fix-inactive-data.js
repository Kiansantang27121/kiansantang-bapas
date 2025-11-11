import db from './database.js';

console.log('🔧 Fixing inactive PK and Clients data...\n');

try {
  // Fix PK data - set is_active = 1 for all PK with is_active = 0 or NULL
  const pkResult = db.prepare('UPDATE pk SET is_active = 1 WHERE is_active IS NULL OR is_active = 0').run();
  console.log(`✅ Fixed ${pkResult.changes} PK records`);

  // Fix Clients data - set is_active = 1 for all clients with is_active = 0 or NULL
  const clientsResult = db.prepare('UPDATE clients SET is_active = 1 WHERE is_active IS NULL OR is_active = 0').run();
  console.log(`✅ Fixed ${clientsResult.changes} Clients records`);

  // Show current counts
  const pkCount = db.prepare('SELECT COUNT(*) as count FROM pk WHERE is_active = 1').get();
  const clientsCount = db.prepare('SELECT COUNT(*) as count FROM clients WHERE is_active = 1').get();

  console.log('\n📊 Current Active Data:');
  console.log(`   PK: ${pkCount.count}`);
  console.log(`   Clients: ${clientsCount.count}`);

  console.log('\n✅ Done! Data sekarang akan muncul di Management PK/Klien.');
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
