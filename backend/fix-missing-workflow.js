import db from './database.js';

console.log('🔧 FIXING MISSING WORKFLOW RECORDS\n');
console.log('='.repeat(80));

// Find queues with PK but no workflow
console.log('\n📋 Step 1: Finding queues with PK but no workflow...\n');

const queuesNeedingWorkflow = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.pk_id,
    u.name as pk_name,
    s.name as service_name
  FROM queue q
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN services s ON q.service_id = s.id
  WHERE q.pk_id IS NOT NULL
  AND q.id NOT IN (SELECT queue_id FROM queue_workflow)
`).all();

console.log(`Found ${queuesNeedingWorkflow.length} queues needing workflow records\n`);

if (queuesNeedingWorkflow.length === 0) {
  console.log('✅ No queues need workflow records. All good!');
  process.exit(0);
}

// Show details
queuesNeedingWorkflow.forEach(q => {
  console.log(`Queue: ${q.queue_number}`);
  console.log(`  Client: ${q.client_name}`);
  console.log(`  Service: ${q.service_name}`);
  console.log(`  PK: ${q.pk_name} (ID: ${q.pk_id})`);
  console.log(`  Status: Missing workflow record ❌`);
  console.log('');
});

// Create workflow records
console.log('📝 Step 2: Creating workflow records...\n');

const insertWorkflow = db.prepare(`
  INSERT INTO queue_workflow (queue_id, pk_id, action, created_at, updated_at)
  VALUES (?, ?, 'approve', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

queuesNeedingWorkflow.forEach(q => {
  try {
    insertWorkflow.run(q.id, q.pk_id);
    console.log(`✅ Created workflow for queue ${q.queue_number} (${q.client_name}) - PK: ${q.pk_name}`);
  } catch (error) {
    console.error(`❌ Failed to create workflow for queue ${q.queue_number}:`, error.message);
  }
});

// Verify
console.log('\n📋 Step 3: Verification...\n');

const verifyQueues = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    u.name as pk_name,
    wf.action
  FROM queue q
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.pk_id IS NOT NULL
`).all();

console.log(`Queues with PK: ${verifyQueues.length}`);
verifyQueues.forEach(q => {
  const status = q.action ? `✅ ${q.action}` : '❌ No workflow';
  console.log(`  ${q.queue_number} - ${q.client_name} (PK: ${q.pk_name}): ${status}`);
});

// Check ready to call
console.log('\n📋 Step 4: Checking ready to call...\n');

const readyToCall = db.prepare(`
  SELECT 
    q.queue_number,
    q.client_name,
    u.name as pk_name,
    wf.action
  FROM queue q
  JOIN services s ON q.service_id = s.id
  LEFT JOIN users u ON q.pk_id = u.id
  LEFT JOIN queue_workflow wf ON q.id = wf.queue_id
  WHERE q.status = 'waiting'
  AND q.pk_id IS NOT NULL
  AND wf.action = 'approve'
  AND s.name LIKE '%Bimbingan Wajib Lapor%'
`).all();

console.log(`Ready to call PK: ${readyToCall.length}`);
readyToCall.forEach(q => {
  console.log(`  ✅ ${q.queue_number} - ${q.client_name} (PK: ${q.pk_name})`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ FIX COMPLETE!\n');
console.log('Next steps:');
console.log('1. Refresh Petugas Layanan dashboard');
console.log('2. Check "Panggilan 1: PK Masuk Ruangan"');
console.log('3. Should see the queues now');
