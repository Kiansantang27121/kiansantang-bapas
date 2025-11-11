import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Migrating database to add petugas roles...\n');

try {
  // Disable foreign keys temporarily
  db.exec('PRAGMA foreign_keys = OFF');
  
  // Start transaction
  db.exec('BEGIN TRANSACTION');

  // Step 1: Create new users table with updated role constraint
  console.log('📝 Creating new users table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'operator', 'petugas_layanan', 'pk', 'struktural')),
      name TEXT NOT NULL,
      pk_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pk_id) REFERENCES pk(id)
    )
  `);

  // Step 2: Copy data from old table to new table
  console.log('📋 Copying existing users...');
  db.exec(`
    INSERT INTO users_new (id, username, password, role, name, created_at)
    SELECT id, username, password, role, name, created_at
    FROM users
  `);

  // Step 3: Drop old table
  console.log('🗑️  Dropping old users table...');
  db.exec('DROP TABLE users');

  // Step 4: Rename new table
  console.log('✏️  Renaming new table...');
  db.exec('ALTER TABLE users_new RENAME TO users');

  // Commit transaction
  db.exec('COMMIT');
  
  // Re-enable foreign keys
  db.exec('PRAGMA foreign_keys = ON');

  console.log('\n✅ Migration completed successfully!\n');
  console.log('📊 Updated role constraint:');
  console.log('   - admin');
  console.log('   - operator');
  console.log('   - petugas_layanan');
  console.log('   - pk');
  console.log('   - struktural');
  console.log('');

} catch (error) {
  // Rollback on error
  db.exec('ROLLBACK');
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

db.close();
