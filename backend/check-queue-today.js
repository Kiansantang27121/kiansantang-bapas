import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, 'bapas.db'));

console.log('📋 Queue Today:\n');

const queue = db.prepare(`
  SELECT queue_number, client_name, service_id, status, created_at
  FROM queue 
  WHERE DATE(created_at) = DATE('now')
  ORDER BY created_at DESC
`).all();

if (queue.length === 0) {
  console.log('  (empty)');
} else {
  queue.forEach(q => {
    console.log(`  ${q.queue_number} | ${q.client_name} | ${q.status}`);
  });
}

console.log(`\nTotal: ${queue.length} entries`);

db.close();
