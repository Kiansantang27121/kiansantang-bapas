import db from './database.js';

console.log('🔍 CHECKING PK BUDIANA QUEUE\n');
console.log('='.repeat(80));

// Find Budiana in both tables
console.log('\n📋 Step 1: Finding Budiana...\n');

const budianaInPK = db.prepare("SELECT * FROM pk WHERE name LIKE ? COLLATE NOCASE").get('%budiana%');
const budianaInUsers = db.prepare("SELECT * FROM users WHERE name LIKE ? COLLATE NOCASE").get('%budiana%');

console.log('In pk table:');
if (budianaInPK) {
  console.log(`  ID: ${budianaInPK.id} - ${budianaInPK.name}`);
} else {
  console.log('  ❌ Not found');
}

console.log('\nIn users table:');
if (budianaInUsers) {
  console.log(`  ID: ${budianaInUsers.id} - ${budianaInUsers.name} (username: ${budianaInUsers.username})`);
} else {
  console.log('  ❌ Not found');
}

// Check queues for Budiana
console.log('\n📋 Step 2: Checking queues for Budiana...\n');

if (budianaInPK) {
  console.log(`Looking for queues with pk_id = ${budianaInPK.id} (from pk table)`);
  
  const queuesWithPKTableId = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      pk.name as pk_name_from_pk_table,
      u.name as pk_name_from_users_table
    FROM queue q
    LEFT JOIN services s ON q.service_id = s.id
    LEFT JOIN pk ON q.pk_id = pk.id
    LEFT JOIN users u ON q.pk_id = u.id
    WHERE q.pk_id = ?
  `).all(budianaInPK.id);
  
  console.log(`\nFound ${queuesWithPKTableId.length} queues with pk_id = ${budianaInPK.id}:`);
  queuesWithPKTableId.forEach(q => {
    console.log(`\n  Queue: ${q.queue_number}`);
    console.log(`    Client: ${q.client_name}`);
    console.log(`    Service: ${q.service_name}`);
    console.log(`    PK ID: ${q.pk_id}`);
    console.log(`    PK Name (from pk table): ${q.pk_name_from_pk_table}`);
    console.log(`    PK Name (from users table): ${q.pk_name_from_users_table}`);
    console.log(`    Status: ${q.status}`);
    console.log(`    Room: ${q.room_number || 'NULL'}`);
    console.log(`    PK Called: ${q.pk_called_at || 'NULL'}`);
    console.log(`    PK Entered: ${q.pk_entered_at || 'NULL'}`);
  });
}

if (budianaInUsers) {
  console.log(`\n\nLooking for queues with pk_id = ${budianaInUsers.id} (from users table)`);
  
  const queuesWithUsersTableId = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name
    FROM queue q
    LEFT JOIN services s ON q.service_id = s.id
    WHERE q.pk_id = ?
  `).all(budianaInUsers.id);
  
  console.log(`\nFound ${queuesWithUsersTableId.length} queues with pk_id = ${budianaInUsers.id}:`);
  queuesWithUsersTableId.forEach(q => {
    console.log(`\n  Queue: ${q.queue_number}`);
    console.log(`    Client: ${q.client_name}`);
    console.log(`    Service: ${q.service_name}`);
    console.log(`    Status: ${q.status}`);
  });
}

// Check what PK dashboard query would return
console.log('\n📋 Step 3: Checking PK dashboard query...\n');

if (budianaInUsers) {
  console.log(`PK Dashboard query for user_id = ${budianaInUsers.id}:`);
  
  // My assignments query
  const myAssignments = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      pk.name as pk_name
    FROM queue q
    JOIN services s ON q.service_id = s.id
    LEFT JOIN pk ON q.pk_id = pk.id
    WHERE q.pk_id = ?
    AND q.status = 'waiting'
    AND s.name LIKE '%Bimbingan Wajib Lapor%'
  `).all(budianaInUsers.id);
  
  console.log(`\nMy Assignments: ${myAssignments.length}`);
  myAssignments.forEach(q => {
    console.log(`  - ${q.queue_number}: ${q.client_name} (${q.pk_name})`);
  });
  
  // Called to room query
  const calledToRoom = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name
    FROM queue q
    JOIN services s ON q.service_id = s.id
    WHERE q.pk_id = ?
    AND q.pk_called_at IS NOT NULL
    AND q.pk_entered_at IS NULL
    AND s.name LIKE '%Bimbingan Wajib Lapor%'
  `).all(budianaInUsers.id);
  
  console.log(`\nCalled to Room: ${calledToRoom.length}`);
  calledToRoom.forEach(q => {
    console.log(`  - ${q.queue_number}: ${q.client_name} (Room ${q.room_number})`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:\n');
console.log(`Budiana in pk table: ID ${budianaInPK?.id || 'N/A'}`);
console.log(`Budiana in users table: ID ${budianaInUsers?.id || 'N/A'}`);
console.log('\n⚠️  PROBLEM: ID mismatch between tables!');
console.log('   Queue uses pk_id from pk table');
console.log('   Dashboard uses user_id from users table');
console.log('   Solution: Need to map pk.id to users.id');

console.log('\n' + '='.repeat(80));
console.log('✅ CHECK COMPLETE\n');
