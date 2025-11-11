import db from './database.js';

console.log('🔍 CHECKING ALL ROLES AND ACCOUNTS\n');
console.log('='.repeat(80));

// 1. Check all users grouped by role
console.log('\n📊 USERS BY ROLE:\n');

const roles = ['admin', 'operator', 'petugas_layanan', 'pk', 'struktural'];

roles.forEach(role => {
  const users = db.prepare('SELECT id, username, name, role FROM users WHERE role = ? ORDER BY name').all(role);
  console.log(`\n${role.toUpperCase()} (${users.length} users):`);
  if (users.length === 0) {
    console.log('  ⚠️  No users found');
  } else {
    users.forEach(user => {
      console.log(`  ✅ ID: ${user.id} | Username: ${user.username} | Name: ${user.name}`);
    });
  }
});

// 2. Check for users with invalid roles
console.log('\n\n⚠️  USERS WITH INVALID ROLES:\n');
const invalidUsers = db.prepare(`
  SELECT id, username, name, role 
  FROM users 
  WHERE role NOT IN ('admin', 'operator', 'petugas_layanan', 'pk', 'struktural')
`).all();

if (invalidUsers.length === 0) {
  console.log('  ✅ All users have valid roles');
} else {
  invalidUsers.forEach(user => {
    console.log(`  ❌ ID: ${user.id} | Username: ${user.username} | Role: "${user.role}"`);
  });
}

// 3. Check total users
console.log('\n\n📈 SUMMARY:\n');
const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(`Total Users: ${totalUsers.count}`);

roles.forEach(role => {
  const count = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get(role);
  console.log(`  - ${role}: ${count.count}`);
});

// 4. Check for duplicate usernames
console.log('\n\n🔍 CHECKING FOR DUPLICATES:\n');
const duplicates = db.prepare(`
  SELECT username, COUNT(*) as count 
  FROM users 
  GROUP BY username 
  HAVING count > 1
`).all();

if (duplicates.length === 0) {
  console.log('  ✅ No duplicate usernames');
} else {
  console.log('  ❌ Found duplicates:');
  duplicates.forEach(dup => {
    console.log(`    - ${dup.username} (${dup.count} times)`);
  });
}

// 5. Test accounts for each role
console.log('\n\n🧪 TEST ACCOUNTS:\n');

const testAccounts = [
  { role: 'admin', username: 'admin', password: 'admin123' },
  { role: 'petugas_layanan', username: 'petugas', password: 'petugas123' },
  { role: 'pk', username: 'budiana', password: '[check database]' },
  { role: 'struktural', username: '[check database]', password: '[check database]' }
];

testAccounts.forEach(acc => {
  const user = db.prepare('SELECT id, username, name, role FROM users WHERE username = ?').get(acc.username);
  if (user) {
    console.log(`✅ ${acc.role.toUpperCase()}: ${acc.username} (${user.name})`);
    console.log(`   Password: ${acc.password}`);
  } else {
    console.log(`❌ ${acc.role.toUpperCase()}: ${acc.username} NOT FOUND`);
  }
});

// 6. Check services
console.log('\n\n🔧 SERVICES:\n');
const services = db.prepare('SELECT id, name, is_active FROM services ORDER BY id').all();
services.forEach(service => {
  const status = service.is_active ? '✅ Active' : '❌ Inactive';
  console.log(`  ${status} | ID: ${service.id} | ${service.name}`);
});

// 7. Check queues by service
console.log('\n\n📋 QUEUES BY SERVICE:\n');
services.forEach(service => {
  const count = db.prepare('SELECT COUNT(*) as count FROM queue WHERE service_id = ?').get(service.id);
  console.log(`  ${service.name}: ${count.count} queues`);
});

// 8. Check queues by status
console.log('\n\n📊 QUEUES BY STATUS:\n');
const statuses = ['waiting', 'called', 'serving', 'completed', 'cancelled', 'rejected'];
statuses.forEach(status => {
  const count = db.prepare('SELECT COUNT(*) as count FROM queue WHERE status = ?').get(status);
  if (count.count > 0) {
    console.log(`  ${status}: ${count.count}`);
  }
});

// 9. Check queues with PK assignment
console.log('\n\n👥 QUEUES WITH PK ASSIGNMENT:\n');
const withPK = db.prepare('SELECT COUNT(*) as count FROM queue WHERE pk_id IS NOT NULL').get();
const withoutPK = db.prepare('SELECT COUNT(*) as count FROM queue WHERE pk_id IS NULL').get();
console.log(`  With PK: ${withPK.count}`);
console.log(`  Without PK: ${withoutPK.count}`);

// 10. Recommendations
console.log('\n\n💡 RECOMMENDATIONS:\n');

if (invalidUsers.length > 0) {
  console.log('  ⚠️  Fix users with invalid roles');
}

const petugasCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'petugas_layanan'").get();
if (petugasCount.count === 0) {
  console.log('  ⚠️  Create at least one petugas_layanan user');
}

const pkCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'pk'").get();
if (pkCount.count === 0) {
  console.log('  ⚠️  Create at least one PK user');
}

const bwlService = db.prepare("SELECT * FROM services WHERE name LIKE '%Bimbingan Wajib Lapor%'").get();
if (!bwlService) {
  console.log('  ⚠️  Create "Bimbingan Wajib Lapor" service');
}

if (invalidUsers.length === 0 && petugasCount.count > 0 && pkCount.count > 0 && bwlService) {
  console.log('  ✅ All checks passed! System ready to use.');
}

console.log('\n' + '='.repeat(80));
console.log('✅ CHECK COMPLETE\n');
