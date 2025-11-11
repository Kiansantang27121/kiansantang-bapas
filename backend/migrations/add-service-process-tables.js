import db from '../database.js';

console.log('🔧 ADDING SERVICE PROCESS TABLES\n');
console.log('='.repeat(80));

try {
  // Add columns to queue table
  console.log('\n📋 Step 1: Adding columns to queue table...\n');
  
  try {
    db.prepare(`
      ALTER TABLE queue ADD COLUMN service_data TEXT
    `).run();
    console.log('✅ Added service_data column');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('⚠️  service_data column already exists');
    } else {
      throw e;
    }
  }
  
  try {
    db.prepare(`
      ALTER TABLE queue ADD COLUMN service_step INTEGER DEFAULT 1
    `).run();
    console.log('✅ Added service_step column');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('⚠️  service_step column already exists');
    } else {
      throw e;
    }
  }

  // Create service_reports table
  console.log('\n📋 Step 2: Creating service_reports table...\n');
  
  db.prepare(`
    CREATE TABLE IF NOT EXISTS service_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER NOT NULL,
      queue_number TEXT NOT NULL,
      client_nik TEXT,
      client_name TEXT NOT NULL,
      pk_id INTEGER NOT NULL,
      pk_name TEXT NOT NULL,
      service_date DATE NOT NULL,
      room_number INTEGER,
      
      -- 5 Pertanyaan Wajib
      question1 TEXT NOT NULL,
      question2 TEXT NOT NULL,
      question3 TEXT NOT NULL,
      question4 TEXT NOT NULL,
      question5 TEXT NOT NULL,
      
      -- Dokumentasi
      photos_count INTEGER DEFAULT 0,
      notes TEXT,
      
      -- Survey Kepuasan
      satisfaction INTEGER NOT NULL, -- 1: Tidak Puas, 2: Cukup, 3: Sangat Puas
      feedback TEXT,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (queue_id) REFERENCES queue(id),
      FOREIGN KEY (pk_id) REFERENCES pk(id)
    )
  `).run();
  console.log('✅ service_reports table created');

  // Create service_photos table
  console.log('\n📋 Step 3: Creating service_photos table...\n');
  
  db.prepare(`
    CREATE TABLE IF NOT EXISTS service_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER NOT NULL,
      photo_data TEXT NOT NULL, -- Base64 encoded image
      photo_order INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (queue_id) REFERENCES queue(id)
    )
  `).run();
  console.log('✅ service_photos table created');

  // Add index for better performance
  console.log('\n📋 Step 4: Creating indexes...\n');
  
  try {
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_service_reports_date 
      ON service_reports(service_date)
    `).run();
    console.log('✅ Index on service_date created');
  } catch (e) {
    console.log('⚠️  Index already exists');
  }
  
  try {
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_service_reports_pk 
      ON service_reports(pk_id)
    `).run();
    console.log('✅ Index on pk_id created');
  } catch (e) {
    console.log('⚠️  Index already exists');
  }
  
  try {
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_service_reports_client 
      ON service_reports(client_nik)
    `).run();
    console.log('✅ Index on client_nik created');
  } catch (e) {
    console.log('⚠️  Index already exists');
  }

  // Add last_service_date to clients table
  console.log('\n📋 Step 5: Updating clients table...\n');
  
  try {
    db.prepare(`
      ALTER TABLE clients ADD COLUMN last_service_date DATETIME
    `).run();
    console.log('✅ Added last_service_date column to clients');
  } catch (e) {
    if (e.message.includes('duplicate column name')) {
      console.log('⚠️  last_service_date column already exists');
    } else {
      throw e;
    }
  }

  // Verify tables
  console.log('\n📋 Step 6: Verifying tables...\n');
  
  const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    AND name IN ('service_reports', 'service_photos')
  `).all();
  
  console.log(`Found ${tables.length} new tables:`);
  tables.forEach(t => console.log(`  - ${t.name}`));

  // Show sample structure
  console.log('\n📋 Step 7: Table structures...\n');
  
  const reportsInfo = db.prepare(`PRAGMA table_info(service_reports)`).all();
  console.log('\nservice_reports columns:');
  reportsInfo.forEach(col => {
    console.log(`  ${col.name} (${col.type})`);
  });
  
  const photosInfo = db.prepare(`PRAGMA table_info(service_photos)`).all();
  console.log('\nservice_photos columns:');
  photosInfo.forEach(col => {
    console.log(`  ${col.name} (${col.type})`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ SERVICE PROCESS TABLES MIGRATION COMPLETE!\n');
  
  console.log('📊 Summary:');
  console.log('  ✅ queue table updated (service_data, service_step)');
  console.log('  ✅ service_reports table created');
  console.log('  ✅ service_photos table created');
  console.log('  ✅ clients table updated (last_service_date)');
  console.log('  ✅ Indexes created for performance');
  
  console.log('\n📝 Next steps:');
  console.log('  1. Register route in server.js');
  console.log('  2. Add menu link in PK app');
  console.log('  3. Test service process flow');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
