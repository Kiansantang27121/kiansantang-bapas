import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(dirname(__dirname), 'bapas.db'));

// Add pk_id and client_id columns to queue table if they don't exist
try {
  // Check if columns exist
  const tableInfo = db.prepare("PRAGMA table_info(queue)").all();
  const hasPkId = tableInfo.some(col => col.name === 'pk_id');
  const hasClientId = tableInfo.some(col => col.name === 'client_id');

  if (!hasPkId) {
    console.log('Adding pk_id column to queue table...');
    db.exec('ALTER TABLE queue ADD COLUMN pk_id INTEGER REFERENCES pk(id)');
    console.log('✅ pk_id column added');
  } else {
    console.log('pk_id column already exists');
  }

  if (!hasClientId) {
    console.log('Adding client_id column to queue table...');
    db.exec('ALTER TABLE queue ADD COLUMN client_id INTEGER REFERENCES clients(id)');
    console.log('✅ client_id column added');
  } else {
    console.log('client_id column already exists');
  }

  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration error:', error);
  process.exit(1);
}

db.close();
