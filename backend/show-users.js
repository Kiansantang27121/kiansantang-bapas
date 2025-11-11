import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('           DAFTAR USER - KIANSANTANG BAPAS BANDUNG');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const users = db.prepare('SELECT id, username, role, name FROM users ORDER BY role, username').all();

console.log('📋 Total Users:', users.length);
console.log('');

// Group by role
const roles = {
  'admin': [],
  'operator': [],
  'petugas_layanan': [],
  'pk': [],
  'struktural': []
};

users.forEach(user => {
  if (roles[user.role]) {
    roles[user.role].push(user);
  }
});

// Display by role
Object.keys(roles).forEach(role => {
  if (roles[role].length > 0) {
    console.log('─────────────────────────────────────────────────────────────');
    console.log(`🔐 ROLE: ${role.toUpperCase()}`);
    console.log('─────────────────────────────────────────────────────────────');
    
    roles[role].forEach(user => {
      console.log(`   Username: ${user.username}`);
      console.log(`   Name:     ${user.name}`);
      console.log(`   Password: ${getDefaultPassword(user.role, user.username)}`);
      console.log('');
    });
  }
});

console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('📝 CATATAN:');
console.log('   - Password di atas adalah password DEFAULT yang umum digunakan');
console.log('   - Password sebenarnya di-hash di database untuk keamanan');
console.log('   - Jika password tidak berfungsi, gunakan password default:');
console.log('     • Admin: admin123');
console.log('     • Operator: operator123');
console.log('     • Petugas: petugas123');
console.log('     • PK: pk123');
console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

db.close();

function getDefaultPassword(role, username) {
  // Common default passwords based on role
  if (username === 'admin') return 'admin123';
  if (role === 'admin') return 'admin123';
  if (role === 'operator') return 'operator123';
  if (role === 'petugas_layanan') return 'petugas123';
  if (role === 'pk') return 'pk123';
  if (role === 'struktural') return 'struktural123';
  return 'password123';
}
