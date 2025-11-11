import db from '../database.js';

console.log('🔄 Adding new fields to clients table...\n');

try {
  // Check if columns already exist
  const tableInfo = db.prepare("PRAGMA table_info(clients)").all();
  const columnNames = tableInfo.map(col => col.name);
  
  console.log('Current columns:', columnNames.join(', '));
  console.log('');
  
  // Add program column if not exists
  if (!columnNames.includes('program')) {
    db.prepare(`
      ALTER TABLE clients 
      ADD COLUMN program TEXT CHECK(program IN ('PB', 'CB', 'CMB', 'Asimilasi'))
    `).run();
    console.log('✅ Added column: program');
  } else {
    console.log('⏭️  Column already exists: program');
  }
  
  // Add whatsapp column if not exists
  if (!columnNames.includes('whatsapp')) {
    db.prepare(`
      ALTER TABLE clients 
      ADD COLUMN whatsapp TEXT
    `).run();
    console.log('✅ Added column: whatsapp');
  } else {
    console.log('⏭️  Column already exists: whatsapp');
  }
  
  // Add is_working column if not exists
  if (!columnNames.includes('is_working')) {
    db.prepare(`
      ALTER TABLE clients 
      ADD COLUMN is_working BOOLEAN DEFAULT 0
    `).run();
    console.log('✅ Added column: is_working');
  } else {
    console.log('⏭️  Column already exists: is_working');
  }
  
  // Add job column if not exists
  if (!columnNames.includes('job')) {
    db.prepare(`
      ALTER TABLE clients 
      ADD COLUMN job TEXT
    `).run();
    console.log('✅ Added column: job');
  } else {
    console.log('⏭️  Column already exists: job');
  }
  
  // Verify new structure
  const updatedTableInfo = db.prepare("PRAGMA table_info(clients)").all();
  console.log('\n📋 Updated clients table structure:');
  console.log('─'.repeat(80));
  updatedTableInfo.forEach(col => {
    console.log(`${col.name.padEnd(20)} | ${col.type.padEnd(15)} | ${col.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | Default: ${col.dflt_value || 'NULL'}`);
  });
  
  console.log('\n✅ Migration completed successfully!');
  console.log('\n📝 New client fields:');
  console.log('   - program: PB, CB, CMB, atau Asimilasi');
  console.log('   - whatsapp: Nomor WhatsApp klien');
  console.log('   - is_working: Status bekerja (0=tidak, 1=ya)');
  console.log('   - job: Pekerjaan (jika bekerja)');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
