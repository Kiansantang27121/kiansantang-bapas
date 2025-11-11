import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Updating User Roles...\n');

try {
  // 1. Update petugas_layanan user to role petugas_layanan
  console.log('📝 Updating petugas_layanan user...');
  const result1 = db.prepare(`
    UPDATE users 
    SET role = 'petugas_layanan' 
    WHERE username = 'petugas_layanan'
  `).run();
  
  if (result1.changes > 0) {
    console.log('✅ Updated user: petugas_layanan → role: petugas_layanan');
  } else {
    console.log('⚠️  User petugas_layanan not found');
  }
  console.log('');

  // 2. Get all users with "PK" in their name
  console.log('📝 Finding users with "PK" in name...');
  const pkUsers = db.prepare(`
    SELECT id, username, name, role 
    FROM users 
    WHERE name LIKE '%PK%' OR name LIKE '%pk%'
  `).all();

  if (pkUsers.length === 0) {
    console.log('⚠️  No users found with "PK" in name');
  } else {
    console.log(`Found ${pkUsers.length} user(s) with "PK" in name:\n`);
    
    // Display before update
    pkUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.name})`);
      console.log(`    Current role: ${user.role}`);
    });
    console.log('');

    // 3. Update all PK users to role 'pk'
    console.log('📝 Updating roles to "pk"...');
    const result2 = db.prepare(`
      UPDATE users 
      SET role = 'pk' 
      WHERE name LIKE '%PK%' OR name LIKE '%pk%'
    `).run();

    console.log(`✅ Updated ${result2.changes} user(s) to role: pk\n`);
  }

  // 4. Display final results
  console.log('📊 Final User List:');
  console.log('─────────────────────────────────────────────────────────');
  const allUsers = db.prepare(`
    SELECT username, name, role 
    FROM users 
    ORDER BY role, username
  `).all();

  let currentRole = '';
  allUsers.forEach(user => {
    if (user.role !== currentRole) {
      currentRole = user.role;
      console.log(`\n[${currentRole.toUpperCase()}]`);
    }
    console.log(`  ${user.username.padEnd(20)} | ${user.name}`);
  });
  console.log('─────────────────────────────────────────────────────────');

  console.log('\n✅ Update completed successfully!\n');

} catch (error) {
  console.error('❌ Error updating roles:', error.message);
  process.exit(1);
}

db.close();
