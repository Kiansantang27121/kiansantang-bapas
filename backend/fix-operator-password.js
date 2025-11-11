import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('🔧 FIXING OPERATOR PASSWORDS\n');

const operators = [
  { username: 'petugas_penghadapan', password: 'operator123' },
  { username: 'petugas_kunjungan', password: 'operator123' },
  { username: 'petugas_pengaduan', password: 'operator123' }
];

for (const op of operators) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(op.username);
  
  if (user) {
    console.log(`Updating password for: ${op.username}`);
    const hashedPassword = await bcrypt.hash(op.password, 10);
    db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hashedPassword, op.username);
    console.log(`✅ Password updated to: ${op.password}\n`);
  } else {
    console.log(`⚠️  User not found: ${op.username}\n`);
  }
}

console.log('✅ OPERATOR PASSWORDS FIXED\n');
console.log('Test logins:');
operators.forEach(op => {
  console.log(`  Username: ${op.username}`);
  console.log(`  Password: ${op.password}\n`);
});
