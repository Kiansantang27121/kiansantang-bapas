import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('📊 KIANSANTANG - User Roles Summary\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Count by role
const roleCounts = db.prepare(`
  SELECT role, COUNT(*) as count 
  FROM users 
  GROUP BY role 
  ORDER BY role
`).all();

console.log('📈 Users by Role:');
console.log('─────────────────────────────────────────────────────────');
roleCounts.forEach(({ role, count }) => {
  const emoji = 
    role === 'admin' ? '👑' :
    role === 'operator' ? '💼' :
    role === 'petugas_layanan' ? '👥' :
    role === 'pk' ? '✓' :
    role === 'struktural' ? '🛡️' : '❓';
  
  console.log(`${emoji} ${role.toUpperCase().padEnd(20)} : ${count} user(s)`);
});
console.log('─────────────────────────────────────────────────────────\n');

// Show petugas users
console.log('👥 Petugas Layanan Users:');
console.log('─────────────────────────────────────────────────────────');
const petugasLayanan = db.prepare(`
  SELECT username, name 
  FROM users 
  WHERE role = 'petugas_layanan'
`).all();

if (petugasLayanan.length === 0) {
  console.log('  (none)');
} else {
  petugasLayanan.forEach(user => {
    console.log(`  ✓ ${user.username.padEnd(25)} | ${user.name}`);
  });
}
console.log('');

// Show PK users
console.log('✓ PK Users:');
console.log('─────────────────────────────────────────────────────────');
const pkUsers = db.prepare(`
  SELECT username, name 
  FROM users 
  WHERE role = 'pk'
`).all();

if (pkUsers.length === 0) {
  console.log('  (none)');
} else {
  pkUsers.forEach(user => {
    console.log(`  ✓ ${user.username.padEnd(25)} | ${user.name}`);
  });
}
console.log('');

// Show Struktural users
console.log('🛡️ Struktural Users:');
console.log('─────────────────────────────────────────────────────────');
const strukturalUsers = db.prepare(`
  SELECT username, name 
  FROM users 
  WHERE role = 'struktural'
`).all();

if (strukturalUsers.length === 0) {
  console.log('  (none)');
} else {
  strukturalUsers.forEach(user => {
    console.log(`  ✓ ${user.username.padEnd(25)} | ${user.name}`);
  });
}
console.log('');

console.log('═══════════════════════════════════════════════════════════');
console.log('\n✅ Total Users:', db.prepare('SELECT COUNT(*) as count FROM users').get().count);
console.log('');

db.close();
