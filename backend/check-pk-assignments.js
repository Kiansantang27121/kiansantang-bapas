import db from './database.js';

console.log('🔍 CHECKING PK ASSIGNMENTS\n');
console.log('='.repeat(80));

try {
  // Get Budiana's info
  console.log('\n📋 Step 1: Budiana Info...\n');
  
  const budiana = db.prepare(`
    SELECT 
      pk.id as pk_id,
      pk.name as pk_name,
      pk.user_id,
      u.id as user_id_check,
      u.name as user_name,
      u.username
    FROM pk
    LEFT JOIN users u ON pk.user_id = u.id
    WHERE pk.name LIKE '%budiana%'
  `).get();
  
  if (!budiana) {
    console.log('❌ Budiana not found!');
    process.exit(1);
  }
  
  console.log(`✅ PK: ${budiana.pk_name}`);
  console.log(`   pk.id: ${budiana.pk_id}`);
  console.log(`   pk.user_id: ${budiana.user_id}`);
  console.log(`   users.id: ${budiana.user_id_check}`);
  console.log(`   username: ${budiana.username}`);

  // Check queues assigned to Budiana
  console.log('\n📋 Step 2: Queues Assigned to Budiana (pk_id)...\n');
  
  const queuesByPkId = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name
    FROM queue q
    JOIN services s ON q.service_id = s.id
    WHERE q.pk_id = ?
    AND q.status IN ('waiting', 'called')
    ORDER BY q.created_at DESC
  `).all(budiana.pk_id);
  
  console.log(`Found ${queuesByPkId.length} queues assigned to pk_id=${budiana.pk_id}`);
  
  if (queuesByPkId.length === 0) {
    console.log('⚠️  No queues assigned to this PK!');
    
    // Check all queues
    console.log('\n📋 Step 3: All Active Queues...\n');
    
    const allQueues = db.prepare(`
      SELECT 
        q.id,
        q.queue_number,
        q.client_name,
        q.pk_id,
        q.status,
        pk.name as pk_name
      FROM queue q
      LEFT JOIN pk ON q.pk_id = pk.id
      WHERE q.status IN ('waiting', 'called')
      AND DATE(q.created_at) = DATE('now')
      ORDER BY q.created_at DESC
    `).all();
    
    console.log(`Total active queues today: ${allQueues.length}\n`);
    
    allQueues.forEach(q => {
      console.log(`  ${q.queue_number}: ${q.client_name}`);
      console.log(`    Status: ${q.status}`);
      console.log(`    PK ID: ${q.pk_id || 'NULL'}`);
      console.log(`    PK Name: ${q.pk_name || 'Not Assigned'}`);
      console.log('');
    });
    
  } else {
    queuesByPkId.forEach(q => {
      console.log(`  ${q.queue_number}: ${q.client_name}`);
      console.log(`    Service: ${q.service_name}`);
      console.log(`    Status: ${q.status}`);
      console.log(`    Room: ${q.room_number || 'Not assigned'}`);
      console.log(`    PK Called: ${q.pk_called_at || 'No'}`);
      console.log(`    PK Entered: ${q.pk_entered_at || 'No'}`);
      console.log('');
    });
  }

  // Test the API query that PK dashboard uses
  console.log('\n📋 Step 4: Testing PK Dashboard Query...\n');
  
  const dashboardQuery = db.prepare(`
    SELECT 
      q.*,
      s.name as service_name,
      s.estimated_time,
      u.name as assigned_by_name
    FROM queue q
    JOIN services s ON q.service_id = s.id
    LEFT JOIN users u ON q.operator_id = u.id
    WHERE q.pk_id = ?
    AND q.status IN ('waiting', 'called')
    ORDER BY q.created_at DESC
  `).all(budiana.pk_id);
  
  console.log(`Dashboard query result: ${dashboardQuery.length} queues`);
  
  if (dashboardQuery.length === 0) {
    console.log('❌ Dashboard query returns empty!');
    console.log('\n💡 Possible causes:');
    console.log('   1. No queues assigned to this PK (pk_id)');
    console.log('   2. All queues have status other than waiting/called');
    console.log('   3. Queues are from different date');
  } else {
    dashboardQuery.forEach(q => {
      console.log(`  ✅ ${q.queue_number}: ${q.client_name}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`PK: ${budiana.pk_name} (pk.id=${budiana.pk_id}, user_id=${budiana.user_id})`);
  console.log(`Queues assigned: ${queuesByPkId.length}`);
  console.log(`Dashboard shows: ${dashboardQuery.length}`);
  
  if (queuesByPkId.length === 0) {
    console.log('\n⚠️  PROBLEM: No queues assigned to this PK!');
    console.log('\n💡 SOLUTION: Assign queue to PK from Petugas Layanan dashboard');
  }
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
