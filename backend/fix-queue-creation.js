import db from './database.js';

console.log('🔧 FIXING QUEUE CREATION ISSUE\n');
console.log('='.repeat(80));

try {
  // Step 1: Check operator account
  console.log('\n📋 Step 1: Checking operator account...\n');
  
  const operator = db.prepare(`
    SELECT id, username, name, role FROM users WHERE role = 'operator'
  `).get();
  
  if (!operator) {
    console.log('❌ No operator account found!');
    process.exit(1);
  }
  
  console.log('✅ Operator account found:');
  console.log(`   ID: ${operator.id}`);
  console.log(`   Username: ${operator.username}`);
  console.log(`   Name: ${operator.name}`);

  // Step 2: Check recent queue attempts
  console.log('\n📋 Step 2: Checking recent queue attempts...\n');
  
  const recentQueues = db.prepare(`
    SELECT 
      id, 
      queue_number, 
      client_name, 
      operator_id,
      created_at
    FROM queue 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all();
  
  console.log(`Recent queues: ${recentQueues.length}`);
  recentQueues.forEach(q => {
    console.log(`  ${q.queue_number}: ${q.client_name}`);
    console.log(`    operator_id: ${q.operator_id || 'NULL'}`);
    console.log(`    created: ${q.created_at}`);
    console.log('');
  });

  // Step 3: Check if operator_id column allows NULL
  console.log('\n📋 Step 3: Checking queue table schema...\n');
  
  const tableInfo = db.pragma('table_info(queue)');
  const operatorIdCol = tableInfo.find(col => col.name === 'operator_id');
  
  if (operatorIdCol) {
    console.log('operator_id column:');
    console.log(`  Type: ${operatorIdCol.type}`);
    console.log(`  Not Null: ${operatorIdCol.notnull}`);
    console.log(`  Default: ${operatorIdCol.dflt_value}`);
  }

  // Step 4: Test queue creation
  console.log('\n📋 Step 4: Testing queue creation...\n');
  
  try {
    // Get a test client
    const testClient = db.prepare(`
      SELECT id, nik, name FROM clients LIMIT 1
    `).get();
    
    if (!testClient) {
      console.log('⚠️  No clients in database to test with');
    } else {
      console.log(`Test client: ${testClient.name} (${testClient.nik})`);
      
      // Get a service
      const service = db.prepare(`
        SELECT id, name FROM services WHERE name LIKE '%BIMBINGAN%' LIMIT 1
      `).get();
      
      if (!service) {
        console.log('⚠️  No service found');
      } else {
        console.log(`Test service: ${service.name}`);
        
        // Try to create a test queue
        console.log('\nAttempting to create test queue...');
        
        const result = db.prepare(`
          INSERT INTO queue (
            queue_number,
            client_id,
            client_name,
            client_nik,
            service_id,
            operator_id,
            status,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(
          'TEST001',
          testClient.id,
          testClient.name,
          testClient.nik,
          service.id,
          operator.id,
          'pending'
        );
        
        console.log(`✅ Test queue created with ID: ${result.lastInsertRowid}`);
        
        // Delete test queue
        db.prepare('DELETE FROM queue WHERE queue_number = ?').run('TEST001');
        console.log('✅ Test queue deleted');
      }
    }
  } catch (error) {
    console.error('❌ Queue creation test failed:', error.message);
  }

  // Step 5: Check for any constraints
  console.log('\n📋 Step 5: Checking foreign key constraints...\n');
  
  const foreignKeys = db.pragma('foreign_key_list(queue)');
  console.log(`Foreign keys on queue table: ${foreignKeys.length}`);
  foreignKeys.forEach(fk => {
    console.log(`  ${fk.from} → ${fk.table}.${fk.to}`);
  });

  // Step 6: Verify operator can be used
  console.log('\n📋 Step 6: Verifying operator ID validity...\n');
  
  const operatorExists = db.prepare(`
    SELECT COUNT(*) as count FROM users WHERE id = ? AND role = 'operator'
  `).get(operator.id);
  
  if (operatorExists.count > 0) {
    console.log(`✅ Operator ID ${operator.id} is valid`);
  } else {
    console.log(`❌ Operator ID ${operator.id} is NOT valid`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 DIAGNOSIS COMPLETE\n');
  
  console.log('Operator Account:');
  console.log(`  ID: ${operator.id}`);
  console.log(`  Username: ${operator.username}`);
  console.log(`  Status: Valid`);
  
  console.log('\n💡 Solution:');
  console.log('  1. Make sure frontend uses correct operator_id');
  console.log('  2. Check if token includes correct user ID');
  console.log('  3. Verify API endpoint receives operator_id');
  
  console.log('\n🔑 For Testing:');
  console.log('  Login: operator / operator123');
  console.log(`  User ID: ${operator.id}`);
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
