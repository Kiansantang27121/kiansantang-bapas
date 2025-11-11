import db from './database.js';

console.log('🔧 ADDING user_id TO pk TABLE\n');
console.log('='.repeat(80));

// Step 1: Check if column exists
console.log('\n📋 Step 1: Checking if user_id column exists...\n');

const tableInfo = db.prepare('PRAGMA table_info(pk)').all();
const hasUserIdColumn = tableInfo.some(col => col.name === 'user_id');

if (hasUserIdColumn) {
  console.log('✅ user_id column already exists');
} else {
  console.log('❌ user_id column does not exist');
  console.log('Adding column...\n');
  
  db.prepare('ALTER TABLE pk ADD COLUMN user_id INTEGER').run();
  console.log('✅ user_id column added');
}

// Step 2: Map PK to users by name
console.log('\n📋 Step 2: Mapping PK to users by name...\n');

const allPK = db.prepare('SELECT id, name FROM pk WHERE is_active = 1').all();
console.log(`Total PK: ${allPK.length}\n`);

let mapped = 0;
let notFound = 0;

allPK.forEach(pk => {
  // Find matching user by name (case-insensitive)
  const user = db.prepare("SELECT id FROM users WHERE LOWER(name) = LOWER(?) AND role = 'pk'").get(pk.name);
  
  if (user) {
    db.prepare('UPDATE pk SET user_id = ? WHERE id = ?').run(user.id, pk.id);
    console.log(`✅ Mapped: ${pk.name} (pk.id=${pk.id}) → user.id=${user.id}`);
    mapped++;
  } else {
    console.log(`⚠️  Not found: ${pk.name} (pk.id=${pk.id}) - no matching user`);
    notFound++;
  }
});

// Step 3: Verify mapping
console.log('\n📋 Step 3: Verification...\n');

const mappedPK = db.prepare(`
  SELECT 
    pk.id as pk_id,
    pk.name as pk_name,
    pk.user_id,
    u.name as user_name,
    u.username
  FROM pk
  LEFT JOIN users u ON pk.user_id = u.id
  WHERE pk.is_active = 1
  ORDER BY pk.name
  LIMIT 10
`).all();

console.log('Sample mappings:\n');
mappedPK.forEach(pk => {
  if (pk.user_id) {
    console.log(`  ${pk.pk_name} (pk.id=${pk.pk_id}) → user.id=${pk.user_id} (${pk.user_name}, @${pk.username})`);
  } else {
    console.log(`  ${pk.pk_name} (pk.id=${pk.pk_id}) → ❌ No mapping`);
  }
});

// Check Budiana specifically
console.log('\n📋 Step 4: Checking Budiana mapping...\n');

const budiana = db.prepare(`
  SELECT 
    pk.id as pk_id,
    pk.name as pk_name,
    pk.user_id,
    u.name as user_name,
    u.username
  FROM pk
  LEFT JOIN users u ON pk.user_id = u.id
  WHERE pk.name LIKE ? COLLATE NOCASE
`).get('%budiana%');

if (budiana) {
  console.log(`Budiana mapping:`);
  console.log(`  pk.id: ${budiana.pk_id}`);
  console.log(`  user_id: ${budiana.user_id}`);
  console.log(`  user.name: ${budiana.user_name}`);
  console.log(`  username: ${budiana.username}`);
  
  // Check queues
  const queues = db.prepare('SELECT * FROM queue WHERE pk_id = ?').all(budiana.pk_id);
  console.log(`\n  Queues with pk_id=${budiana.pk_id}: ${queues.length}`);
  queues.forEach(q => {
    console.log(`    - ${q.queue_number}: ${q.client_name} (Room ${q.room_number || 'N/A'})`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('📊 SUMMARY:\n');
console.log(`Total PK: ${allPK.length}`);
console.log(`Mapped: ${mapped}`);
console.log(`Not found: ${notFound}`);

console.log('\n' + '='.repeat(80));
console.log('✅ MAPPING COMPLETE!\n');
console.log('Next step: Update PK dashboard query to use user_id');
