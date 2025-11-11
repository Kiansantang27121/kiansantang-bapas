import db from './database.js';

console.log('🔍 CHECKING WORKFLOW DATA\n');
console.log('='.repeat(80));

// Check queue_workflow table
console.log('\n📋 Queue Workflow Table:\n');
const workflows = db.prepare('SELECT * FROM queue_workflow ORDER BY updated_at DESC LIMIT 10').all();
console.log(`Total workflows: ${workflows.length}`);
workflows.forEach(wf => {
  console.log(`\nWorkflow ID: ${wf.id}`);
  console.log(`  Queue ID: ${wf.queue_id}`);
  console.log(`  Action: ${wf.action}`);
  console.log(`  PK ID: ${wf.pk_id}`);
  console.log(`  Reason: ${wf.reason || 'N/A'}`);
  console.log(`  Updated: ${wf.updated_at}`);
});

// Check queues with pk_id
console.log('\n📋 Queues with PK assigned:\n');
const queuesWithPK = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.status,
    q.pk_id,
    u.name as pk_name,
    s.name as service_name
  FROM queue q
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN services s ON q.service_id = s.id
  WHERE q.pk_id IS NOT NULL
  ORDER BY q.created_at DESC
  LIMIT 10
`).all();

console.log(`Total queues with PK: ${queuesWithPK.length}`);
queuesWithPK.forEach(q => {
  console.log(`\nQueue: ${q.queue_number}`);
  console.log(`  Client: ${q.client_name}`);
  console.log(`  Service: ${q.service_name}`);
  console.log(`  PK: ${q.pk_name} (ID: ${q.pk_id})`);
  console.log(`  Status: ${q.status}`);
  
  // Check if has workflow
  const wf = db.prepare('SELECT * FROM queue_workflow WHERE queue_id = ?').get(q.id);
  if (wf) {
    console.log(`  ✅ Workflow: ${wf.action}`);
  } else {
    console.log(`  ❌ No workflow record`);
  }
});

// Check ready to call query
console.log('\n📋 Ready to Call Query Result:\n');
const readyToCall = db.prepare(`
  SELECT 
    q.*,
    s.name as service_name,
    u.name as pk_name,
    wf.action as workflow_action
  FROM queue q
  JOIN services s ON q.service_id = s.id
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.status = 'waiting'
  AND q.pk_id IS NOT NULL
  AND wf.action = 'approve'
  AND s.name LIKE '%Bimbingan Wajib Lapor%'
`).all();

console.log(`Ready to call count: ${readyToCall.length}`);
readyToCall.forEach(q => {
  console.log(`\n✅ ${q.queue_number} - ${q.client_name}`);
  console.log(`   PK: ${q.pk_name}`);
  console.log(`   Service: ${q.service_name}`);
  console.log(`   Workflow: ${q.workflow_action}`);
});

if (readyToCall.length === 0) {
  console.log('\n⚠️  No queues ready to call!');
  console.log('\nPossible issues:');
  console.log('1. No queues with pk_id');
  console.log('2. No workflow records with action = "approve"');
  console.log('3. Queue status is not "waiting"');
  console.log('4. Service name does not match "Bimbingan Wajib Lapor"');
}

console.log('\n' + '='.repeat(80));
console.log('✅ CHECK COMPLETE\n');
