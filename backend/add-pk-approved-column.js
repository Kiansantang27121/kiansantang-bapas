import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Adding pk_approved_at column to queue table...\n');

try {
  // Check if column already exists
  const columns = db.prepare('PRAGMA table_info(queue)').all();
  const hasColumn = columns.some(col => col.name === 'pk_approved_at');
  
  if (hasColumn) {
    console.log('✅ Column pk_approved_at already exists');
  } else {
    // Add column
    db.prepare('ALTER TABLE queue ADD COLUMN pk_approved_at DATETIME').run();
    console.log('✅ Column pk_approved_at added successfully');
  }
  
  // Show current columns
  console.log('\n📋 Current queue table columns:');
  const allColumns = db.prepare('PRAGMA table_info(queue)').all();
  allColumns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
console.log('\n✅ Done!');
