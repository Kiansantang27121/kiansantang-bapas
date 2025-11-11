import db from './database.js';

console.log('🔧 FIXING WORKFLOW TABLE\n');
console.log('='.repeat(80));

// Check if queue_workflow table exists
console.log('\n📋 Step 1: Checking queue_workflow table...\n');

const tableExists = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name='queue_workflow'
`).get();

if (tableExists) {
  console.log('✅ queue_workflow table exists');
} else {
  console.log('❌ queue_workflow table does NOT exist');
  console.log('Creating table...\n');
  
  db.prepare(`
    CREATE TABLE queue_workflow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER NOT NULL,
      pk_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (queue_id) REFERENCES queue(id),
      FOREIGN KEY (pk_id) REFERENCES users(id)
    )
  `).run();
  
  console.log('✅ queue_workflow table created');
}

// Check queues that need workflow records
console.log('\n📋 Step 2: Checking queues with PK but no workflow...\n');

const queuesNeedingWorkflow = db.prepare(`
  SELECT 
    q.id,
    q.queue_number,
    q.client_name,
    q.pk_id,
    u.name as pk_name
  FROM queue q
  LEFT JOIN users u ON q.pk_id = u.id
  WHERE q.pk_id IS NOT NULL
  AND q.id NOT IN (SELECT queue_id FROM queue_workflow)
`).all();

console.log(`Found ${queuesNeedingWorkflow.length} queues needing workflow records`);

if (queuesNeedingWorkflow.length > 0) {
  console.log('\n📝 Creating workflow records...\n');
  
  const insertWorkflow = db.prepare(`
    INSERT INTO queue_workflow (queue_id, pk_id, action, created_at, updated_at)
    VALUES (?, ?, 'approve', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  
  queuesNeedingWorkflow.forEach(q => {
    insertWorkflow.run(q.id, q.pk_id);
    console.log(`✅ Created workflow for queue ${q.queue_number} (${q.client_name}) - PK: ${q.pk_name}`);
  });
  
  console.log(`\n✅ Created ${queuesNeedingWorkflow.length} workflow records`);
}

// Verify
console.log('\n📋 Step 3: Verification...\n');

const workflows = db.prepare('SELECT COUNT(*) as count FROM queue_workflow').get();
console.log(`Total workflow records: ${workflows.count}`);

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

console.log(`\nQueues ready to call: ${readyToCall.length}`);
readyToCall.forEach(q => {
  console.log(`  ✅ ${q.queue_number} - ${q.client_name} (PK: ${q.pk_name})`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ WORKFLOW TABLE FIXED!\n');
console.log('Next steps:');
console.log('1. Restart backend server');
console.log('2. Refresh petugas layanan dashboard');
console.log('3. Check "Panggilan 1: PK Masuk Ruangan" section');
