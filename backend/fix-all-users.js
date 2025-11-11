import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Memperbaiki semua user...\n');

// List of users to fix/create
const users = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator', pk_id: null },
  { username: 'operator', password: 'operator123', role: 'operator', name: 'Operator Registrasi', pk_id: null },
  { username: 'petugas', password: 'petugas123', role: 'petugas_layanan', name: 'Petugas Layanan', pk_id: null },
  { username: 'struktural', password: 'struktural123', role: 'struktural', name: 'Struktural/Kepala', pk_id: null },
  { username: 'apk', password: 'pk123', role: 'pk', name: 'APK (Shared)', pk_id: null },
  { username: 'pk_madya', password: 'pk123', role: 'pk', name: 'PK Madya (Shared)', pk_id: null },
  { username: 'pk_muda', password: 'pk123', role: 'pk', name: 'PK Muda (Shared)', pk_id: null },
  { username: 'pk_pertama', password: 'pk123', role: 'pk', name: 'PK Pertama (Shared)', pk_id: null }
];

async function fixUsers() {
  for (const user of users) {
    try {
      // Check if user exists
      const existing = db.prepare('SELECT id, username FROM users WHERE username = ?').get(user.username);
      
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      if (existing) {
        // Update existing user
        db.prepare(`
          UPDATE users 
          SET password = ?, role = ?, name = ?, pk_id = ?
          WHERE username = ?
        `).run(hashedPassword, user.role, user.name, user.pk_id, user.username);
        
        console.log(`✅ Updated: ${user.username} (${user.role})`);
      } else {
        // Create new user
        db.prepare(`
          INSERT INTO users (username, password, role, name, pk_id)
          VALUES (?, ?, ?, ?, ?)
        `).run(user.username, hashedPassword, user.role, user.name, user.pk_id);
        
        console.log(`✅ Created: ${user.username} (${user.role})`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${user.username}:`, error.message);
    }
  }
}

// Run fix
await fixUsers();

console.log('\n📊 Verifikasi semua user:');
console.log('═══════════════════════════════════════════════════════════\n');

const allUsers = db.prepare('SELECT id, username, role, name FROM users ORDER BY role, username').all();

allUsers.forEach(user => {
  const password = users.find(u => u.username === user.username)?.password || 'N/A';
  console.log(`👤 ${user.username.padEnd(15)} | ${user.role.padEnd(20)} | Password: ${password}`);
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`✅ Total users: ${allUsers.length}`);
console.log('\n💡 Semua user sudah diperbaiki dan siap digunakan!');

db.close();
