import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, 'bapas.db'));

console.log('🧹 Clearing old queue data...\n');

try {
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Count old queue
  const oldCount = db.prepare(`
    SELECT COUNT(*) as count 
    FROM queue 
    WHERE DATE(created_at) < DATE('now')
  `).get();
  
  console.log(`📊 Old queue entries: ${oldCount.count}`);
  
  // Delete old queue (keep today's only)
  const result = db.prepare(`
    DELETE FROM queue 
    WHERE DATE(created_at) < DATE('now')
  `).run();
  
  console.log(`✅ Deleted ${result.changes} old queue entries`);
  
  // Show remaining queue
  const remaining = db.prepare('SELECT COUNT(*) as count FROM queue').get();
  console.log(`📋 Remaining queue entries: ${remaining.count}\n`);
  
  console.log('✅ Queue cleaned successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
