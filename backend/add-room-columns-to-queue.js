import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Adding room-related columns to queue table...\n');

try {
  // Check existing columns
  const tableInfo = db.prepare('PRAGMA table_info(queue)').all();
  console.log('📋 Current columns:', tableInfo.map(c => c.name).join(', '));
  console.log('');
  
  const columns = tableInfo.map(c => c.name);
  
  // Add room_number column
  if (!columns.includes('room_number')) {
    db.exec('ALTER TABLE queue ADD COLUMN room_number TEXT');
    console.log('✅ Added column: room_number');
  } else {
    console.log('✓ Column room_number already exists');
  }
  
  // Add pk_called_at column
  if (!columns.includes('pk_called_at')) {
    db.exec('ALTER TABLE queue ADD COLUMN pk_called_at DATETIME');
    console.log('✅ Added column: pk_called_at');
  } else {
    console.log('✓ Column pk_called_at already exists');
  }
  
  // Add pk_entered_at column
  if (!columns.includes('pk_entered_at')) {
    db.exec('ALTER TABLE queue ADD COLUMN pk_entered_at DATETIME');
    console.log('✅ Added column: pk_entered_at');
  } else {
    console.log('✓ Column pk_entered_at already exists');
  }
  
  // Add client_called_at column
  if (!columns.includes('client_called_at')) {
    db.exec('ALTER TABLE queue ADD COLUMN client_called_at DATETIME');
    console.log('✅ Added column: client_called_at');
  } else {
    console.log('✓ Column client_called_at already exists');
  }
  
  // Add client_entered_at column
  if (!columns.includes('client_entered_at')) {
    db.exec('ALTER TABLE queue ADD COLUMN client_entered_at DATETIME');
    console.log('✅ Added column: client_entered_at');
  } else {
    console.log('✓ Column client_entered_at already exists');
  }
  
  console.log('\n📊 Updated table structure:');
  const updatedInfo = db.prepare('PRAGMA table_info(queue)').all();
  updatedInfo.forEach(col => {
    console.log(`   ${col.name.padEnd(20)} ${col.type.padEnd(10)} ${col.notnull ? 'NOT NULL' : ''}`);
  });
  
  console.log('\n✅ All columns added successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
