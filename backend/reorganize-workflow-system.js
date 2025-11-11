import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('🔄 REORGANIZING WORKFLOW SYSTEM\n');
console.log('='.repeat(80));

try {
  // Step 1: Analyze current users
  console.log('\n📋 Step 1: Analyzing current users...\n');
  
  const allUsers = db.prepare(`
    SELECT id, username, name, role FROM users ORDER BY role, username
  `).all();
  
  console.log(`Total users: ${allUsers.length}\n`);
  
  // Group by role
  const byRole = {};
  allUsers.forEach(user => {
    if (!byRole[user.role]) byRole[user.role] = [];
    byRole[user.role].push(user);
  });
  
  Object.keys(byRole).forEach(role => {
    console.log(`${role}: ${byRole[role].length} users`);
    byRole[role].forEach(u => console.log(`  - ${u.username} (${u.name})`));
    console.log('');
  });

  // Step 2: Define required accounts for workflow
  console.log('\n📋 Step 2: Defining required accounts...\n');
  
  const requiredAccounts = {
    admin: [
      { username: 'admin', name: 'Administrator', password: 'admin123' }
    ],
    operator: [
      { username: 'operator', name: 'Operator Registrasi', password: 'operator123' }
    ],
    petugas_layanan: [
      { username: 'petugas', name: 'Petugas Layanan', password: 'petugas123' }
    ],
    pk: [
      { username: 'pk_madya', name: 'PK Madya (Shared)', password: 'madya2025', jenjang: 'madya' },
      { username: 'pk_muda', name: 'PK Muda (Shared)', password: 'muda2025', jenjang: 'muda' },
      { username: 'pk_pertama', name: 'PK Pertama (Shared)', password: 'pertama2025', jenjang: 'pertama' },
      { username: 'apk', name: 'APK (Shared)', password: 'apk2025', jenjang: 'apk' }
    ],
    struktural: [
      { username: 'struktural', name: 'Struktural/Kepala', password: 'struktural123' }
    ]
  };

  console.log('Required accounts:');
  Object.keys(requiredAccounts).forEach(role => {
    console.log(`  ${role}: ${requiredAccounts[role].length} accounts`);
  });

  // Step 3: Identify accounts to keep and delete
  console.log('\n📋 Step 3: Identifying accounts to keep/delete...\n');
  
  const requiredUsernames = [];
  Object.values(requiredAccounts).forEach(accounts => {
    accounts.forEach(acc => requiredUsernames.push(acc.username));
  });
  
  const toKeep = allUsers.filter(u => requiredUsernames.includes(u.username));
  const toDelete = allUsers.filter(u => !requiredUsernames.includes(u.username));
  
  console.log(`Accounts to KEEP: ${toKeep.length}`);
  toKeep.forEach(u => console.log(`  ✅ ${u.username} (${u.role})`));
  
  console.log(`\nAccounts to DELETE: ${toDelete.length}`);
  toDelete.forEach(u => console.log(`  ❌ ${u.username} (${u.role}) - ${u.name}`));

  // Step 4: Backup before deletion
  console.log('\n📋 Step 4: Creating backup...\n');
  
  const backupData = {
    timestamp: new Date().toISOString(),
    deleted_users: toDelete,
    kept_users: toKeep
  };
  
  const fs = await import('fs');
  fs.writeFileSync(
    'backup-users-before-cleanup.json',
    JSON.stringify(backupData, null, 2)
  );
  
  console.log('✅ Backup created: backup-users-before-cleanup.json');

  // Step 5: Delete unnecessary accounts
  console.log('\n📋 Step 5: Deleting unnecessary accounts...\n');
  
  if (toDelete.length > 0) {
    const deleteIds = toDelete.map(u => u.id);
    
    // Disable foreign keys temporarily
    db.pragma('foreign_keys = OFF');
    console.log('Foreign keys disabled temporarily');
    
    // First, clean up related data
    console.log('\nCleaning up related data...');
    
    // Clean pk_sessions
    const placeholders1 = deleteIds.map(() => '?').join(',');
    const sessions = db.prepare(`
      DELETE FROM pk_sessions WHERE user_id IN (${placeholders1})
    `).run(...deleteIds);
    console.log(`  - Deleted ${sessions.changes} pk_sessions`);
    
    // Update pk table (remove user_id reference)
    const placeholders2 = deleteIds.map(() => '?').join(',');
    const pks = db.prepare(`
      UPDATE pk SET user_id = NULL WHERE user_id IN (${placeholders2})
    `).run(...deleteIds);
    console.log(`  - Updated ${pks.changes} pk records`);
    
    // Update queue table (remove operator_id reference)
    const placeholders3 = deleteIds.map(() => '?').join(',');
    const queues = db.prepare(`
      UPDATE queue SET operator_id = NULL WHERE operator_id IN (${placeholders3})
    `).run(...deleteIds);
    console.log(`  - Updated ${queues.changes} queue records`);
    
    // Now delete users
    const placeholders4 = deleteIds.map(() => '?').join(',');
    const result = db.prepare(`
      DELETE FROM users WHERE id IN (${placeholders4})
    `).run(...deleteIds);
    
    console.log(`\n✅ Deleted ${result.changes} user accounts`);
    
    // Re-enable foreign keys
    db.pragma('foreign_keys = ON');
    console.log('Foreign keys re-enabled');
  } else {
    console.log('⚠️  No accounts to delete');
  }

  // Step 6: Create/Update required accounts
  console.log('\n📋 Step 6: Creating/Updating required accounts...\n');
  
  for (const [role, accounts] of Object.entries(requiredAccounts)) {
    console.log(`\nProcessing ${role}:`);
    
    for (const account of accounts) {
      const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(account.username);
      
      if (existing) {
        console.log(`  ⚠️  ${account.username} exists, updating...`);
        const hashedPassword = await bcrypt.hash(account.password, 10);
        db.prepare(`
          UPDATE users 
          SET password = ?, name = ?, role = ?, jenjang = ?
          WHERE username = ?
        `).run(hashedPassword, account.name, role, account.jenjang || null, account.username);
      } else {
        console.log(`  ✅ Creating ${account.username}...`);
        const hashedPassword = await bcrypt.hash(account.password, 10);
        db.prepare(`
          INSERT INTO users (username, password, name, role, jenjang)
          VALUES (?, ?, ?, ?, ?)
        `).run(account.username, hashedPassword, account.name, role, account.jenjang || null);
      }
    }
  }

  // Step 7: Verify workflow roles
  console.log('\n📋 Step 7: Verifying workflow roles...\n');
  
  const finalUsers = db.prepare(`
    SELECT username, name, role, jenjang FROM users ORDER BY role, username
  `).all();
  
  console.log('Final user list:');
  const finalByRole = {};
  finalUsers.forEach(user => {
    if (!finalByRole[user.role]) finalByRole[user.role] = [];
    finalByRole[user.role].push(user);
  });
  
  Object.keys(finalByRole).forEach(role => {
    console.log(`\n${role.toUpperCase()}:`);
    finalByRole[role].forEach(u => {
      const jenjangInfo = u.jenjang ? ` [${u.jenjang}]` : '';
      console.log(`  - ${u.username}${jenjangInfo} (${u.name})`);
    });
  });

  // Step 8: Verify PK data
  console.log('\n📋 Step 8: Verifying PK data...\n');
  
  const pkCount = db.prepare('SELECT COUNT(*) as count FROM pk').get();
  const pkByJenjang = db.prepare(`
    SELECT jenjang, COUNT(*) as count 
    FROM pk 
    GROUP BY jenjang
  `).all();
  
  console.log(`Total PK in database: ${pkCount.count}`);
  pkByJenjang.forEach(j => {
    console.log(`  ${j.jenjang}: ${j.count} PK`);
  });

  // Step 9: Clean up orphaned sessions
  console.log('\n📋 Step 9: Cleaning up orphaned sessions...\n');
  
  const orphanedSessions = db.prepare(`
    SELECT COUNT(*) as count FROM pk_sessions 
    WHERE user_id NOT IN (SELECT id FROM users)
  `).get();
  
  if (orphanedSessions.count > 0) {
    console.log(`Found ${orphanedSessions.count} orphaned sessions`);
    db.prepare(`
      DELETE FROM pk_sessions 
      WHERE user_id NOT IN (SELECT id FROM users)
    `).run();
    console.log('✅ Orphaned sessions deleted');
  } else {
    console.log('✅ No orphaned sessions found');
  }

  // Step 10: Summary
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ WORKFLOW SYSTEM REORGANIZED!\n');
  
  console.log('📊 Summary:');
  console.log(`  Total users before: ${allUsers.length}`);
  console.log(`  Deleted: ${toDelete.length}`);
  console.log(`  Final users: ${finalUsers.length}`);
  console.log(`  PK in database: ${pkCount.count}`);
  
  console.log('\n🔑 Login Credentials:');
  console.log('\n  ADMIN:');
  console.log('    admin / admin123');
  
  console.log('\n  OPERATOR (Registrasi):');
  console.log('    operator / operator123');
  
  console.log('\n  PETUGAS LAYANAN:');
  console.log('    petugas / petugas123');
  
  console.log('\n  PK (Shared Accounts):');
  console.log('    pk_madya    / madya2025');
  console.log('    pk_muda     / muda2025');
  console.log('    pk_pertama  / pertama2025');
  console.log('    apk         / apk2025');
  
  console.log('\n  STRUKTURAL:');
  console.log('    struktural / struktural123');
  
  console.log('\n📋 Workflow:');
  console.log('  1. Klien registrasi → operator');
  console.log('  2. Assign ke PK → petugas');
  console.log('  3. Login PK → pk_madya/muda/pertama/apk');
  console.log('  4. Pilih PK → Budiana/Ryan/dll');
  console.log('  5. Proses layanan → PK');
  console.log('  6. Monitoring → struktural');
  
  console.log('\n💾 Backup:');
  console.log('  backup-users-before-cleanup.json');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
