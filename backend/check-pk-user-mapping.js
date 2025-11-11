import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔍 Checking PK User Mapping...\n');

// Check users table
console.log('📋 Users with role PK:');
console.log('═══════════════════════════════════════════════════════════');
const pkUsers = db.prepare(`
  SELECT id, username, name, role, pk_id 
  FROM users 
  WHERE role = 'pk'
  ORDER BY username
`).all();

pkUsers.forEach(user => {
  console.log(`ID: ${user.id} | Username: ${user.username.padEnd(15)} | Name: ${user.name.padEnd(25)} | pk_id: ${user.pk_id || 'NULL'}`);
});

console.log('\n📋 PK Table (sample):');
console.log('═══════════════════════════════════════════════════════════');
const pkTable = db.prepare(`
  SELECT id, name, jabatan 
  FROM pk 
  WHERE jabatan = 'PK Madya'
  ORDER BY name
  LIMIT 10
`).all();

pkTable.forEach(pk => {
  console.log(`ID: ${pk.id} | Name: ${pk.name.padEnd(30)} | Jabatan: ${pk.jabatan}`);
});

console.log('\n📋 Check specific: Budiana');
console.log('═══════════════════════════════════════════════════════════');
const budiana = db.prepare(`SELECT * FROM pk WHERE name LIKE '%Budiana%'`).get();
if (budiana) {
  console.log(`✅ Found in pk table:`);
  console.log(`   ID: ${budiana.id}`);
  console.log(`   Name: ${budiana.name}`);
  console.log(`   Jabatan: ${budiana.jabatan}`);
  console.log(`   NIP: ${budiana.nip}`);
} else {
  console.log('❌ Not found in pk table');
}

console.log('\n📋 Check queues assigned to Budiana (pk_id=40):');
console.log('═══════════════════════════════════════════════════════════');
const queues = db.prepare(`
  SELECT q.id, q.queue_number, q.client_name, q.pk_id, q.status, q.room_number, q.pk_called_at
  FROM queue q
  WHERE q.pk_id = 40
  ORDER BY q.created_at DESC
  LIMIT 5
`).all();

if (queues.length > 0) {
  queues.forEach(q => {
    console.log(`${q.queue_number} | ${q.client_name.padEnd(30)} | Status: ${q.status} | Room: ${q.room_number || '-'}`);
  });
} else {
  console.log('❌ No queues assigned to pk_id=40');
}

console.log('\n💡 Solution:');
console.log('═══════════════════════════════════════════════════════════');
console.log('User "pk_madya" needs to have pk_id set to match PK Madya records');
console.log('OR dashboard needs to query based on jabatan instead of user.pk_id');

db.close();
