import bcrypt from 'bcryptjs';
import db from './database.js';

async function addPetugasUsers() {
  console.log('🔧 Adding Petugas Users...\n');

  const users = [
    {
      username: 'petugas_layanan',
      password: 'petugas123',
      name: 'Petugas Layanan',
      role: 'petugas_layanan'
    },
    {
      username: 'pk',
      password: 'pk123',
      name: 'Pembimbing Kemasyarakatan',
      role: 'pk'
    },
    {
      username: 'struktural',
      password: 'struktural123',
      name: 'Struktural',
      role: 'struktural'
    }
  ];

  for (const user of users) {
    try {
      // Check if user exists
      const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(user.username);
      
      if (existing) {
        console.log(`⚠️  User ${user.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      const result = db.prepare(`
        INSERT INTO users (username, password, name, role)
        VALUES (?, ?, ?, ?)
      `).run(user.username, hashedPassword, user.name, user.role);

      console.log(`✅ Created user: ${user.username}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Password: ${user.password}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error creating user ${user.username}:`, error.message);
    }
  }

  console.log('✅ Done!\n');
  console.log('📝 Login Credentials:');
  console.log('─────────────────────────────────────────');
  console.log('Petugas Layanan:');
  console.log('  Username: petugas_layanan');
  console.log('  Password: petugas123');
  console.log('');
  console.log('PK:');
  console.log('  Username: pk');
  console.log('  Password: pk123');
  console.log('');
  console.log('Struktural:');
  console.log('  Username: struktural');
  console.log('  Password: struktural123');
  console.log('─────────────────────────────────────────');
}

addPetugasUsers().catch(console.error);
