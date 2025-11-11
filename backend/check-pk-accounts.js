import db from './database.js';

console.log('🔍 Checking PK accounts...\n');

try {
  // Check all users with pk_id
  const pkUsers = db.prepare('SELECT id, username, name, role, pk_id FROM users WHERE pk_id IS NOT NULL').all();
  
  console.log(`Total PK accounts: ${pkUsers.length}\n`);
  
  if (pkUsers.length > 0) {
    console.log('First 10 PK accounts:');
    pkUsers.slice(0, 10).forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username} | Name: ${user.name} | PK ID: ${user.pk_id}`);
    });
  }

  // Check if there's a user with username 'budiana'
  console.log('\n🔍 Checking specific username: budiana');
  const budiana = db.prepare('SELECT * FROM users WHERE username = ?').get('budiana');
  if (budiana) {
    console.log('✅ Found:', budiana);
  } else {
    console.log('❌ Not found');
  }

  // Check admin account
  console.log('\n🔍 Checking admin account:');
  const admin = db.prepare('SELECT id, username, name, role FROM users WHERE username = ?').get('admin');
  if (admin) {
    console.log('✅ Found:', admin);
  } else {
    console.log('❌ Not found');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}
