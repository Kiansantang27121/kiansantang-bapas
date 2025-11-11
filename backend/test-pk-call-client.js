import db from './database.js';

console.log('🧪 TESTING PK CALL CLIENT\n');
console.log('='.repeat(80));

// Check Budiana's queues
console.log('\n📋 Step 1: Check Budiana queues ready to call client...\n');

const budiana = db.prepare('SELECT id, user_id FROM pk WHERE name LIKE ?').get('%budiana%');
console.log(`Budiana: pk.id=${budiana.id}, user_id=${budiana.user_id}`);

const readyQueues = db.prepare(`
  SELECT 
    q.*,
    s.name as service_name,
    pk.name as pk_name
  FROM queue q
  JOIN services s ON q.service_id = s.id
  LEFT JOIN pk ON q.pk_id = pk.id
  WHERE q.pk_id = ?
  AND q.pk_entered_at IS NOT NULL
  AND q.client_called_at IS NULL
`).all(budiana.id);

console.log(`\nQueues ready to call client: ${readyQueues.length}\n`);

readyQueues.forEach(q => {
  console.log(`Queue: ${q.queue_number}`);
  console.log(`  Client: ${q.client_name}`);
  console.log(`  PK: ${q.pk_name}`);
  console.log(`  Room: ${q.room_number}`);
  console.log(`  Status: ${q.status}`);
  console.log(`  PK Called: ${q.pk_called_at}`);
  console.log(`  PK Entered: ${q.pk_entered_at}`);
  console.log(`  Client Called: ${q.client_called_at || 'NULL'}`);
  console.log('');
});

// Test calling client for first queue
if (readyQueues.length > 0) {
  console.log('📋 Step 2: Test calling client for first queue...\n');
  
  const testQueue = readyQueues[0];
  console.log(`Testing with queue: ${testQueue.queue_number}`);
  console.log(`Client: ${testQueue.client_name}`);
  console.log(`Room: ${testQueue.room_number}\n`);
  
  // Simulate the update
  console.log('Simulating UPDATE query...');
  console.log(`UPDATE queue SET client_called_at = CURRENT_TIMESTAMP, status = 'called' WHERE id = ${testQueue.id}`);
  
  // Actually update
  db.prepare(`
    UPDATE queue 
    SET client_called_at = CURRENT_TIMESTAMP, status = 'called'
    WHERE id = ?
  `).run(testQueue.id);
  
  console.log('✅ Update executed\n');
  
  // Verify
  const updated = db.prepare('SELECT * FROM queue WHERE id = ?').get(testQueue.id);
  console.log('Verification:');
  console.log(`  client_called_at: ${updated.client_called_at}`);
  console.log(`  status: ${updated.status}`);
  
  // Rollback for testing
  console.log('\n⏪ Rolling back for testing...');
  db.prepare(`
    UPDATE queue 
    SET client_called_at = NULL, status = 'waiting'
    WHERE id = ?
  `).run(testQueue.id);
  console.log('✅ Rolled back');
}

console.log('\n' + '='.repeat(80));
console.log('✅ TEST COMPLETE\n');
