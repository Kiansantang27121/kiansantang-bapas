import db from '../database.js';
import bcrypt from 'bcryptjs';

console.log('🔧 CREATING HYBRID PK SYSTEM\n');
console.log('='.repeat(80));

try {
  // Step 1: Create pk_sessions table
  console.log('\n📋 Step 1: Creating pk_sessions table...\n');
  
  db.prepare(`
    CREATE TABLE IF NOT EXISTS pk_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pk_id INTEGER NOT NULL,
      pk_name TEXT NOT NULL,
      jenjang TEXT,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      logout_time DATETIME,
      is_active INTEGER DEFAULT 1,
      
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (pk_id) REFERENCES pk(id)
    )
  `).run();
  
  console.log('✅ pk_sessions table created');

  // Step 2: Add jenjang column to users table
  console.log('\n📋 Step 2: Adding jenjang to users table...\n');
  
  try {
    db.prepare(`ALTER TABLE users ADD COLUMN jenjang TEXT`).run();
    console.log('✅ jenjang column added to users');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('⚠️  jenjang column already exists');
    } else {
      throw e;
    }
  }

  // Step 3: Add logged_in_as to service_reports (if table exists)
  console.log('\n📋 Step 3: Adding logged_in_as to service_reports...\n');
  
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='service_reports'
  `).get();
  
  if (tableExists) {
    try {
      db.prepare(`ALTER TABLE service_reports ADD COLUMN logged_in_as TEXT`).run();
      console.log('✅ logged_in_as column added to service_reports');
    } catch (e) {
      if (e.message.includes('duplicate column name')) {
        console.log('⚠️  logged_in_as column already exists');
      } else {
        throw e;
      }
    }
  } else {
    console.log('⚠️  service_reports table not found, skipping...');
  }

  // Step 4: Create 4 shared accounts
  console.log('\n📋 Step 4: Creating 4 shared PK accounts...\n');
  
  const sharedAccounts = [
    { username: 'pk_madya', name: 'PK Madya (Shared)', jenjang: 'madya', password: 'madya2025' },
    { username: 'pk_muda', name: 'PK Muda (Shared)', jenjang: 'muda', password: 'muda2025' },
    { username: 'pk_pertama', name: 'PK Pertama (Shared)', jenjang: 'pertama', password: 'pertama2025' },
    { username: 'apk', name: 'APK (Shared)', jenjang: 'apk', password: 'apk2025' }
  ];
  
  for (const account of sharedAccounts) {
    // Check if exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(account.username);
    
    if (existing) {
      console.log(`⚠️  ${account.username} already exists, updating...`);
      const hashedPassword = await bcrypt.hash(account.password, 10);
      db.prepare(`
        UPDATE users 
        SET password = ?, jenjang = ?, name = ?
        WHERE username = ?
      `).run(hashedPassword, account.jenjang, account.name, account.username);
    } else {
      console.log(`✅ Creating ${account.username}...`);
      const hashedPassword = await bcrypt.hash(account.password, 10);
      db.prepare(`
        INSERT INTO users (username, password, name, role, jenjang)
        VALUES (?, ?, ?, 'pk', ?)
      `).run(account.username, hashedPassword, account.name, account.jenjang);
    }
  }

  // Step 5: Add jenjang to pk table and set defaults
  console.log('\n📋 Step 5: Adding jenjang to pk table...\n');
  
  try {
    db.prepare(`ALTER TABLE pk ADD COLUMN jenjang TEXT DEFAULT 'pertama'`).run();
    console.log('✅ jenjang column added to pk table');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('⚠️  jenjang column already exists in pk table');
    } else {
      throw e;
    }
  }
  
  // Set default jenjang for existing PK
  const pkWithoutJenjang = db.prepare(`
    SELECT COUNT(*) as count FROM pk WHERE jenjang IS NULL OR jenjang = ''
  `).get();
  
  console.log(`PK without jenjang: ${pkWithoutJenjang.count}`);
  
  if (pkWithoutJenjang.count > 0) {
    console.log('⚠️  Setting default jenjang to "pertama"...');
    db.prepare(`
      UPDATE pk 
      SET jenjang = 'pertama' 
      WHERE jenjang IS NULL OR jenjang = ''
    `).run();
    console.log('✅ Default jenjang set');
  }

  // Step 6: Show summary
  console.log('\n📋 Step 6: Summary...\n');
  
  const accounts = db.prepare(`
    SELECT username, name, jenjang FROM users 
    WHERE username IN ('pk_madya', 'pk_muda', 'pk_pertama', 'apk')
  `).all();
  
  console.log('Shared Accounts Created:');
  accounts.forEach(acc => {
    console.log(`  ${acc.username} (${acc.jenjang})`);
    console.log(`    Name: ${acc.name}`);
    console.log(`    Password: ${acc.username.replace('pk_', '')}2025`);
    console.log('');
  });

  // Show PK count per jenjang
  const pkByJenjang = db.prepare(`
    SELECT jenjang, COUNT(*) as count 
    FROM pk 
    GROUP BY jenjang
    ORDER BY jenjang
  `).all();
  
  console.log('PK Count by Jenjang:');
  pkByJenjang.forEach(j => {
    console.log(`  ${j.jenjang}: ${j.count} PK`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ HYBRID PK SYSTEM CREATED!\n');
  
  console.log('📊 Summary:');
  console.log('  ✅ pk_sessions table created');
  console.log('  ✅ 4 shared accounts created');
  console.log('  ✅ Audit columns added');
  console.log('  ✅ PK jenjang verified');
  
  console.log('\n🔑 Login Credentials:');
  console.log('  pk_madya    / madya2025');
  console.log('  pk_muda     / muda2025');
  console.log('  pk_pertama  / pertama2025');
  console.log('  apk         / apk2025');
  
  console.log('\n📝 Next Steps:');
  console.log('  1. Update backend auth endpoints');
  console.log('  2. Create PK selection page');
  console.log('  3. Update session management');
  console.log('  4. Test complete flow');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
