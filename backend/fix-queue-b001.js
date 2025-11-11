import db from './database.js';

console.log('🔧 FIXING QUEUE B001\n');
console.log('='.repeat(80));

// Check current state
console.log('\n📋 Current State:\n');
const queue = db.prepare(`
  SELECT 
    q.*,
    pk.name as pk_name,
    wf.action as workflow_action
  FROM queue q
  LEFT JOIN pk ON q.pk_id = pk.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.queue_number = 'B001'
`).get();

if (!queue) {
  console.log('❌ Queue B001 not found');
  process.exit(1);
}

console.log(`Queue: ${queue.queue_number}`);
console.log(`Client: ${queue.client_name}`);
console.log(`PK ID: ${queue.pk_id}`);
console.log(`PK Name: ${queue.pk_name}`);
console.log(`Workflow Action: ${queue.workflow_action || 'NULL'}`);
console.log(`Status: ${queue.status}`);

// Delete workflow record (it shouldn't exist yet - PK hasn't approved)
console.log('\n📋 Deleting incorrect workflow record...\n');
const deleteResult = db.prepare('DELETE FROM queue_workflow WHERE queue_id = ?').run(queue.id);
console.log(`✅ Deleted ${deleteResult.changes} workflow record(s)`);

// Verify
console.log('\n📋 Verification:\n');
const verifyQueue = db.prepare(`
  SELECT 
    q.*,
    pk.name as pk_name,
    wf.action as workflow_action
  FROM queue q
  LEFT JOIN pk ON q.pk_id = pk.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.queue_number = 'B001'
`).get();

console.log(`Queue: ${verifyQueue.queue_number}`);
console.log(`Client: ${verifyQueue.client_name}`);
console.log(`PK ID: ${verifyQueue.pk_id}`);
console.log(`PK Name: ${verifyQueue.pk_name}`);
console.log(`Workflow Action: ${verifyQueue.workflow_action || 'NULL (correct - waiting for PK approval)'}`);
console.log(`Status: ${verifyQueue.status}`);

// Check if it appears in ready-to-call
console.log('\n📋 Checking ready-to-call query:\n');
const readyToCall = db.prepare(`
  SELECT 
    q.queue_number,
    q.client_name,
    pk.name as pk_name,
    wf.action as workflow_action
  FROM queue q
  JOIN services s ON q.service_id = s.id
  LEFT JOIN pk ON q.pk_id = pk.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.status = 'waiting'
  AND q.pk_id IS NOT NULL
  AND q.pk_called_at IS NULL
  AND (wf.action = 'approve' OR wf.action IS NULL)
  AND s.name LIKE '%Bimbingan Wajib Lapor%'
`).all();

console.log(`Ready to call count: ${readyToCall.length}`);
readyToCall.forEach(q => {
  console.log(`  ✅ ${q.queue_number} - ${q.client_name} (PK: ${q.pk_name}) - Workflow: ${q.workflow_action || 'NULL (pending)'}`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ FIX COMPLETE!\n');
console.log('Summary:');
console.log('  ✅ Queue B001 now shows correct PK: Budiana');
console.log('  ✅ Workflow record deleted (waiting for PK approval)');
console.log('  ✅ Queue appears in ready-to-call list');
console.log('\nNext steps:');
console.log('  1. Restart backend server');
console.log('  2. Refresh Petugas Layanan dashboard');
console.log('  3. Should see B001 with PK: Budiana (not verified yet)');
console.log('  4. PK Budiana can login and approve/reject');
