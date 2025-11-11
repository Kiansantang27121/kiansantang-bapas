import db from '../database.js';
import bcrypt from 'bcryptjs';

console.log('🔄 Adding Petugas Roles and Tables...\n');

try {
  // 1. Create tables for different services
  console.log('📝 Creating service-specific tables...');

  // Table for Penghadapan (Court Appearances)
  db.exec(`
    CREATE TABLE IF NOT EXISTS penghadapan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_number TEXT,
      client_id INTEGER,
      client_name TEXT NOT NULL,
      client_nik TEXT,
      client_phone TEXT,
      court_name TEXT,
      hearing_date DATE,
      hearing_time TIME,
      case_number TEXT,
      status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'called', 'serving', 'completed', 'cancelled')),
      assigned_to_petugas_id INTEGER,
      accepted_at DATETIME,
      completed_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);
  console.log('✅ Created table: penghadapan');

  // Table for Kunjungan (Visits)
  db.exec(`
    CREATE TABLE IF NOT EXISTS kunjungan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_number TEXT,
      visitor_name TEXT NOT NULL,
      visitor_nik TEXT,
      visitor_phone TEXT,
      visitor_relation TEXT,
      client_id INTEGER,
      client_name TEXT NOT NULL,
      visit_purpose TEXT,
      status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'called', 'serving', 'completed', 'cancelled', 'rejected')),
      assigned_to_petugas_id INTEGER,
      accepted_at DATETIME,
      completed_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);
  console.log('✅ Created table: kunjungan');

  // Table for Pengaduan (Complaints)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pengaduan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_number TEXT,
      complainant_name TEXT NOT NULL,
      complainant_nik TEXT,
      complainant_phone TEXT,
      complainant_email TEXT,
      complaint_type TEXT,
      complaint_subject TEXT NOT NULL,
      complaint_description TEXT NOT NULL,
      priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
      status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'called', 'serving', 'completed', 'cancelled', 'escalated')),
      assigned_to_petugas_id INTEGER,
      accepted_at DATETIME,
      completed_at DATETIME,
      resolution TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Created table: pengaduan');

  // 2. Add role_type column to users table if not exists
  console.log('\n📝 Updating users table...');
  const usersTableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasRoleType = usersTableInfo.some(col => col.name === 'role_type');
  
  if (!hasRoleType) {
    db.prepare('ALTER TABLE users ADD COLUMN role_type TEXT').run();
    console.log('✅ Added column: role_type to users table');
  }

  // 3. Create default petugas accounts
  console.log('\n👥 Creating default petugas accounts...');
  
  const defaultPassword = 'petugas123';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  const petugasAccounts = [
    {
      username: 'petugas_layanan',
      name: 'Petugas Layanan',
      role: 'operator',
      role_type: 'petugas_layanan'
    },
    {
      username: 'petugas_pk',
      name: 'Petugas PK',
      role: 'operator',
      role_type: 'petugas_pk'
    },
    {
      username: 'petugas_penghadapan',
      name: 'Petugas Penghadapan',
      role: 'operator',
      role_type: 'petugas_penghadapan'
    },
    {
      username: 'petugas_kunjungan',
      name: 'Petugas Kunjungan',
      role: 'operator',
      role_type: 'petugas_kunjungan'
    },
    {
      username: 'petugas_pengaduan',
      name: 'Petugas Pengaduan',
      role: 'operator',
      role_type: 'petugas_pengaduan'
    }
  ];

  let created = 0;
  let skipped = 0;

  for (const account of petugasAccounts) {
    const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(account.username);
    
    if (!existing) {
      db.prepare(`
        INSERT INTO users (username, password, role, role_type, name)
        VALUES (?, ?, ?, ?, ?)
      `).run(account.username, hashedPassword, account.role, account.role_type, account.name);
      
      console.log(`✅ Created: ${account.username} (${account.name})`);
      created++;
    } else {
      // Update role_type if exists
      db.prepare('UPDATE users SET role_type = ? WHERE username = ?').run(account.role_type, account.username);
      console.log(`⏭️  Updated: ${account.username}`);
      skipped++;
    }
  }

  // 4. Add settings for petugas features
  console.log('\n⚙️  Adding petugas feature settings...');
  
  const petugasSettings = [
    {
      key: 'penghadapan_enabled',
      value: 'true',
      description: 'Enable penghadapan service'
    },
    {
      key: 'kunjungan_enabled',
      value: 'true',
      description: 'Enable kunjungan service'
    },
    {
      key: 'pengaduan_enabled',
      value: 'true',
      description: 'Enable pengaduan service'
    },
    {
      key: 'kunjungan_max_duration',
      value: '30',
      description: 'Maximum visit duration in minutes'
    },
    {
      key: 'pengaduan_auto_assign',
      value: 'false',
      description: 'Auto assign complaints to available petugas'
    }
  ];

  let settingsAdded = 0;
  for (const setting of petugasSettings) {
    const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get(setting.key);
    if (!existing) {
      db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)').run(
        setting.key,
        setting.value,
        setting.description
      );
      console.log(`✅ Added setting: ${setting.key}`);
      settingsAdded++;
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Tables Created: 3 (penghadapan, kunjungan, pengaduan)`);
  console.log(`   Petugas Accounts Created: ${created}`);
  console.log(`   Petugas Accounts Updated: ${skipped}`);
  console.log(`   Settings Added: ${settingsAdded}`);
  console.log(`   Default Password: ${defaultPassword}`);

  console.log('\n✅ Migration completed successfully!');
  console.log('\n📝 Petugas Accounts:');
  console.log('   1. petugas_layanan / petugas123 - Petugas Layanan');
  console.log('   2. petugas_pk / petugas123 - Petugas PK');
  console.log('   3. petugas_penghadapan / petugas123 - Petugas Penghadapan');
  console.log('   4. petugas_kunjungan / petugas123 - Petugas Kunjungan');
  console.log('   5. petugas_pengaduan / petugas123 - Petugas Pengaduan');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
