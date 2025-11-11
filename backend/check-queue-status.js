import db from './database.js';

console.log('🔍 CHECKING QUEUE STATUS\n');
console.log('='.repeat(80));

// Check all queues
console.log('\n📋 All Queues:\n');
const allQueues = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.status,
    q.pk_id,
    q.room_number,
    q.pk_called_at,
    q.pk_entered_at,
    q.client_called_at,
    s.name as service_name,
    u.name as pk_name
  FROM queue q
  LEFT JOIN services s ON q.service_id = s.id
  LEFT JOIN users u ON q.pk_id = u.id
  ORDER BY q.created_at DESC
  LIMIT 20
`).all();

console.log(`Total queues: ${allQueues.length}\n`);

allQueues.forEach(q => {
  console.log(`Queue: ${q.queue_number}`);
  console.log(`  Client: ${q.client_name}`);
  console.log(`  Service: ${q.service_name}`);
  console.log(`  Status: ${q.status}`);
  console.log(`  PK ID: ${q.pk_id || 'NULL'}`);
  console.log(`  PK Name: ${q.pk_name || 'Not assigned'}`);
  console.log(`  Room: ${q.room_number || 'NULL'}`);
  console.log(`  PK Called: ${q.pk_called_at || 'NULL'}`);
  console.log(`  PK Entered: ${q.pk_entered_at || 'NULL'}`);
  console.log(`  Client Called: ${q.client_called_at || 'NULL'}`);
  console.log('');
});

// Check pending queues (need assignment)
console.log('\n📋 Pending Queues (Need Assignment):\n');
const pendingQueues = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.status,
    q.pk_id,
    s.name as service_name
  FROM queue q
  JOIN services s ON q.service_id = s.id
  WHERE q.status = 'waiting'
  AND q.pk_id IS NULL
  AND s.name LIKE '%Bimbingan Wajib Lapor%'
`).all();

console.log(`Count: ${pendingQueues.length}`);
pendingQueues.forEach(q => {
  console.log(`  - ${q.queue_number}: ${q.client_name} (${q.service_name})`);
});

// Check ready to call PK
console.log('\n📋 Ready to Call PK:\n');
const readyToCallPK = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.status,
    q.pk_id,
    q.pk_called_at,
    u.name as pk_name,
    s.name as service_name,
    wf.action as workflow_action
  FROM queue q
  JOIN services s ON q.service_id = s.id
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.status = 'waiting'
  AND q.pk_id IS NOT NULL
  AND wf.action = 'approve'
  AND q.pk_called_at IS NULL
  AND s.name LIKE '%Bimbingan Wajib Lapor%'
`).all();

console.log(`Count: ${readyToCallPK.length}`);
readyToCallPK.forEach(q => {
  console.log(`  - ${q.queue_number}: ${q.client_name} → PK: ${q.pk_name} (${q.workflow_action})`);
});

// Check ready to call client
console.log('\n📋 Ready to Call Client:\n');
const readyToCallClient = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.status,
    q.room_number,
    q.pk_entered_at,
    q.client_called_at,
    u.name as pk_name
  FROM queue q
  LEFT JOIN users u ON q.pk_id = u.id
  WHERE q.status = 'waiting'
  AND q.pk_entered_at IS NOT NULL
  AND q.client_called_at IS NULL
`).all();

console.log(`Count: ${readyToCallClient.length}`);
readyToCallClient.forEach(q => {
  console.log(`  - ${q.queue_number}: ${q.client_name} → Room ${q.room_number} (PK entered)`);
});

// Check workflow records
console.log('\n📋 Workflow Records:\n');
const workflows = db.prepare(`
  SELECT 
    wf.id,
    wf.queue_id,
    wf.action,
    q.queue_number,
    q.client_name
  FROM queue_workflow wf
  LEFT JOIN queue q ON wf.queue_id = q.id
  ORDER BY wf.updated_at DESC
  LIMIT 10
`).all();

console.log(`Total workflows: ${workflows.length}`);
workflows.forEach(wf => {
  console.log(`  - Queue ${wf.queue_number} (${wf.client_name}): ${wf.action}`);
});

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:\n');
console.log(`Total Queues: ${allQueues.length}`);
console.log(`Pending (Need Assignment): ${pendingQueues.length}`);
console.log(`Ready to Call PK: ${readyToCallPK.length}`);
console.log(`Ready to Call Client: ${readyToCallClient.length}`);
console.log(`Workflow Records: ${workflows.length}`);

console.log('\n' + '='.repeat(80));
console.log('✅ CHECK COMPLETE\n');
