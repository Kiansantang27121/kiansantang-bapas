import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Adding requires_pk column to services table...\n');

try {
  // Check if column exists
  const columns = db.prepare('PRAGMA table_info(services)').all();
  const hasColumn = columns.some(col => col.name === 'requires_pk');
  
  if (hasColumn) {
    console.log('✅ Column requires_pk already exists');
  } else {
    // Add column
    db.prepare('ALTER TABLE services ADD COLUMN requires_pk INTEGER DEFAULT 0').run();
    console.log('✅ Column requires_pk added');
  }
  
  // Set Bimbingan Wajib Lapor to require PK
  db.prepare("UPDATE services SET requires_pk = 1 WHERE name = 'Bimbingan Wajib Lapor'").run();
  console.log('✅ Bimbingan Wajib Lapor set to requires_pk = 1');
  
  // Show all services
  console.log('\n📋 Services:');
  const services = db.prepare('SELECT * FROM services').all();
  services.forEach(s => {
    console.log(`  - ${s.name}: requires_pk = ${s.requires_pk || 0}`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
console.log('\n✅ Done!');
