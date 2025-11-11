import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Updating PK roles from management data...\n');

// Get all PK names from pk table
const pkList = db.prepare('SELECT name FROM pk WHERE is_active = 1').all();
console.log(`📋 Found ${pkList.length} active PK in database:\n`);

let updated = 0;
let notFound = 0;

pkList.forEach(pk => {
  const pkName = pk.name;
  console.log(`🔍 Searching for user matching: ${pkName}`);
  
  // Extract base name (remove titles like S.Sos, S.H., etc)
  const baseName = pkName.replace(/,?\s*(S\.\w+\.?|A\.Md\.?)/gi, '').trim();
  
  // Try to find user by matching name
  const user = db.prepare(`
    SELECT id, username, name, role 
    FROM users 
    WHERE LOWER(name) LIKE LOWER(?)
    OR LOWER(name) LIKE LOWER(?)
  `).get(`%${baseName}%`, `%${pkName}%`);
  
  if (user) {
    if (user.role !== 'pk') {
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run('pk', user.id);
      console.log(`  ✅ Updated: ${user.username} (${user.name})`);
      console.log(`     ${user.role} → pk\n`);
      updated++;
    } else {
      console.log(`  ℹ️  Already PK: ${user.username}\n`);
    }
  } else {
    console.log(`  ⚠️  No user found\n`);
    notFound++;
  }
});

console.log('═══════════════════════════════════════════');
console.log(`✅ Updated: ${updated} users`);
console.log(`ℹ️  Already PK: ${pkList.length - updated - notFound} users`);
console.log(`⚠️  Not found: ${notFound} users`);
console.log('═══════════════════════════════════════════\n');

db.close();
