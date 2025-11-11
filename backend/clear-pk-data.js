import db from './database.js';

console.log('🗑️  Clearing PK Data...\n');

try {
  // Get count before clearing
  const beforeCount = db.prepare('SELECT COUNT(*) as count FROM pk WHERE is_active = 1').get();
  console.log(`Current Active PK: ${beforeCount.count}`);
  
  // Soft delete (set is_active = 0)
  const result = db.prepare('UPDATE pk SET is_active = 0').run();
  console.log(`✅ Deactivated ${result.changes} PK records`);
  
  // Verify
  const afterCount = db.prepare('SELECT COUNT(*) as count FROM pk WHERE is_active = 1').get();
  console.log(`Remaining Active PK: ${afterCount.count}`);
  
  console.log('\n✅ Done! All PK data cleared.');
  console.log('📝 Sekarang Anda bisa sync ulang dari Google Sheets dengan format yang benar.');
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
