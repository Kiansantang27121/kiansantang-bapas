import db from './database.js';

console.log('📋 Checking users in database...\n');

const users = db.prepare('SELECT id, username, full_name, role FROM users').all();

console.log('Total users:', users.length);
console.log('\n👥 Users list:\n');

users.forEach(user => {
  console.log(`ID: ${user.id}`);
  console.log(`Username: ${user.username}`);
  console.log(`Full Name: ${user.full_name}`);
  console.log(`Role: ${user.role}`);
  console.log('---');
});

// Check for petugas role
const petugas = users.filter(u => u.role === 'petugas');
console.log(`\n✅ Found ${petugas.length} user(s) with role 'petugas'`);

if (petugas.length === 0) {
  console.log('\n⚠️  No petugas user found!');
  console.log('Creating default petugas user...\n');
  
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('petugas123', 10);
  
  try {
    const result = db.prepare(`
      INSERT INTO users (username, password, full_name, role)
      VALUES (?, ?, ?, ?)
    `).run('petugas', hashedPassword, 'Petugas Layanan', 'petugas');
    
    console.log('✅ Petugas user created!');
    console.log('   Username: petugas');
    console.log('   Password: petugas123');
    console.log('   ID:', result.lastInsertRowid);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      console.log('⚠️  Username already exists, updating role...');
      db.prepare("UPDATE users SET role = 'petugas' WHERE username = 'petugas'").run();
      console.log('✅ Role updated to petugas');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}
