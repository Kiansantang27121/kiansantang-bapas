import db from './database.js';

console.log('🔍 CHECKING PK MAPPING\n');
console.log('='.repeat(80));

// Check PK table
console.log('\n📋 PK Table (from pk table):\n');
const pkTable = db.prepare('SELECT id, name, nip FROM pk WHERE is_active = 1 ORDER BY name LIMIT 10').all();
console.log(`Total PK in pk table: ${pkTable.length}\n`);
pkTable.forEach(pk => {
  console.log(`ID: ${pk.id} - ${pk.name} (NIP: ${pk.nip})`);
});

// Check Users table with role pk
console.log('\n📋 Users Table (role = pk):\n');
const pkUsers = db.prepare("SELECT id, username, name FROM users WHERE role = 'pk' ORDER BY name LIMIT 10").all();
console.log(`Total PK in users table: ${pkUsers.length}\n`);
pkUsers.forEach(pk => {
  console.log(`ID: ${pk.id} - ${pk.name} (username: ${pk.username})`);
});

// Check specific PK: Budiana
console.log('\n📋 Looking for "Budiana":\n');
const budianaInPK = db.prepare("SELECT * FROM pk WHERE name LIKE ? COLLATE NOCASE").all('%budiana%');
const budianaInUsers = db.prepare("SELECT * FROM users WHERE name LIKE ? COLLATE NOCASE").all('%budiana%');

console.log('In pk table:');
budianaInPK.forEach(pk => {
  console.log(`  ID: ${pk.id} - ${pk.name} (NIP: ${pk.nip})`);
});

console.log('\nIn users table:');
budianaInUsers.forEach(user => {
  console.log(`  ID: ${user.id} - ${user.name} (username: ${user.username}, role: ${user.role})`);
});

// Check queue B001
console.log('\n📋 Queue B001 Details:\n');
const queue = db.prepare(`
  SELECT 
    q.*,
    s.name as service_name,
    pk_table.name as pk_name_from_pk_table,
    pk_user.name as pk_name_from_users
  FROM queue q
  LEFT JOIN services s ON q.service_id = s.id
  LEFT JOIN pk pk_table ON q.pk_id = pk_table.id
  LEFT JOIN users pk_user ON q.pk_id = pk_user.id
  WHERE q.queue_number = 'B001'
`).get();

if (queue) {
  console.log(`Queue Number: ${queue.queue_number}`);
  console.log(`Client: ${queue.client_name}`);
  console.log(`Service: ${queue.service_name}`);
  console.log(`PK ID in queue: ${queue.pk_id}`);
  console.log(`PK Name (from pk table): ${queue.pk_name_from_pk_table || 'NULL'}`);
  console.log(`PK Name (from users table): ${queue.pk_name_from_users || 'NULL'}`);
  console.log(`Status: ${queue.status}`);
} else {
  console.log('Queue B001 not found');
}

// Check workflow for B001
console.log('\n📋 Workflow for B001:\n');
const workflow = db.prepare(`
  SELECT 
    wf.*,
    q.queue_number,
    pk_table.name as pk_name_from_pk_table,
    pk_user.name as pk_name_from_users
  FROM queue_workflow wf
  LEFT JOIN queue q ON wf.queue_id = q.id
  LEFT JOIN pk pk_table ON wf.pk_id = pk_table.id
  LEFT JOIN users pk_user ON wf.pk_id = pk_user.id
  WHERE q.queue_number = 'B001'
`).get();

if (workflow) {
  console.log(`Queue: ${workflow.queue_number}`);
  console.log(`PK ID in workflow: ${workflow.pk_id}`);
  console.log(`PK Name (from pk table): ${workflow.pk_name_from_pk_table || 'NULL'}`);
  console.log(`PK Name (from users table): ${workflow.pk_name_from_users || 'NULL'}`);
  console.log(`Action: ${workflow.action}`);
  console.log(`Created: ${workflow.created_at}`);
} else {
  console.log('No workflow record for B001');
}

console.log('\n' + '='.repeat(80));
console.log('✅ CHECK COMPLETE\n');
