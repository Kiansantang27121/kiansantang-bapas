import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'bapas.db');
const backupPath = join(__dirname, 'bapas.db.backup');

// Backup existing database
if (fs.existsSync(dbPath)) {
  console.log('📦 Backing up existing database...');
  fs.copyFileSync(dbPath, backupPath);
  console.log('✅ Backup created: bapas.db.backup');
  
  // Delete old database
  console.log('🗑️  Deleting old database...');
  fs.unlinkSync(dbPath);
  console.log('✅ Old database deleted');
}

console.log('');
console.log('✅ Database reset complete!');
console.log('📝 Please restart the backend server to create a new database.');
console.log('   Run: npm run dev');
