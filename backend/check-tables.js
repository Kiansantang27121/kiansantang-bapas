import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔍 Checking database tables...\n');

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

console.log('📋 Available tables:');
console.log('═══════════════════════════════════════════════════════════');
tables.forEach(table => {
  console.log(`  - ${table.name}`);
});

console.log('\n📊 Checking queue_workflow table...');
const hasWorkflow = tables.some(t => t.name === 'queue_workflow');
if (hasWorkflow) {
  console.log('✅ queue_workflow table exists');
  const columns = db.prepare('PRAGMA table_info(queue_workflow)').all();
  console.log('\nColumns:');
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
} else {
  console.log('❌ queue_workflow table does NOT exist');
  console.log('\n💡 This table is optional for the workflow');
  console.log('   The system can work without it');
}

db.close();
