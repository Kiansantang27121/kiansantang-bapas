import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('👨‍💼 Creating Petugas user...\n');

// Check if petugas user exists
const existing = db.prepare("SELECT * FROM users WHERE username = 'petugas'").get();

if (existing) {
  console.log('⚠️  User "petugas" already exists');
  console.log('Current role:', existing.role);
  
  if (existing.role !== 'petugas') {
    console.log('Updating role to "petugas"...');
    db.prepare("UPDATE users SET role = 'petugas' WHERE username = 'petugas'").run();
    console.log('✅ Role updated!');
  } else {
    console.log('✅ Role is already correct');
  }
} else {
  console.log('Creating new petugas user...');
  
  const hashedPassword = await bcrypt.hash('petugas123', 10);
  
  const result = db.prepare(`
    INSERT INTO users (username, password, name, role)
    VALUES (?, ?, ?, ?)
  `).run('petugas', hashedPassword, 'Petugas Layanan', 'petugas_layanan');
  
  console.log('✅ Petugas user created!');
  console.log('   ID:', result.lastInsertRowid);
  console.log('   Username: petugas');
  console.log('   Password: petugas123');
  console.log('   Name: Petugas Layanan');
  console.log('   Role: petugas');
}

console.log('\n📋 All users with role "petugas_layanan":');
const petugasUsers = db.prepare("SELECT id, username, name, role FROM users WHERE role = 'petugas_layanan'").all();
petugasUsers.forEach(user => {
  console.log(`   - ${user.username} (${user.name}) [ID: ${user.id}]`);
});

if (petugasUsers.length === 0) {
  console.log('   (none)');
}
