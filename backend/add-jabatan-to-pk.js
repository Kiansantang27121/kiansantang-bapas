import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Adding jabatan column to pk table...\n');

try {
  // Check if column exists
  const tableInfo = db.prepare('PRAGMA table_info(pk)').all();
  const hasJabatan = tableInfo.some(col => col.name === 'jabatan');
  
  if (hasJabatan) {
    console.log('✅ Column jabatan already exists');
  } else {
    // Add jabatan column
    db.exec('ALTER TABLE pk ADD COLUMN jabatan TEXT');
    console.log('✅ Column jabatan added to pk table');
  }
  
  // Update existing PK with jabatan based on their names
  console.log('\n📝 Updating PK with jabatan...');
  
  const updates = [
    // APK
    { pattern: 'APK', jabatan: 'APK' },
    { pattern: 'Ahli Pembimbing', jabatan: 'APK' },
    
    // PK Madya
    { pattern: 'Madya', jabatan: 'PK Madya' },
    { pattern: 'MADYA', jabatan: 'PK Madya' },
    
    // PK Muda
    { pattern: 'Muda', jabatan: 'PK Muda' },
    { pattern: 'MUDA', jabatan: 'PK Muda' },
    
    // PK Pertama
    { pattern: 'Pertama', jabatan: 'PK Pertama' },
    { pattern: 'PERTAMA', jabatan: 'PK Pertama' }
  ];
  
  const allPK = db.prepare('SELECT id, name FROM pk').all();
  
  allPK.forEach(pk => {
    // Try to match pattern in name
    let jabatan = null;
    
    for (const update of updates) {
      if (pk.name.includes(update.pattern)) {
        jabatan = update.jabatan;
        break;
      }
    }
    
    if (jabatan) {
      db.prepare('UPDATE pk SET jabatan = ? WHERE id = ?').run(jabatan, pk.id);
      console.log(`✅ ${pk.name} → ${jabatan}`);
    } else {
      // Default to PK Pertama if no pattern matched
      db.prepare('UPDATE pk SET jabatan = ? WHERE id = ?').run('PK Pertama', pk.id);
      console.log(`⚠️  ${pk.name} → PK Pertama (default)`);
    }
  });
  
  console.log('\n📊 Final PK list with jabatan:');
  console.log('═══════════════════════════════════════════════════════════');
  
  const finalPK = db.prepare('SELECT id, name, jabatan FROM pk ORDER BY jabatan, name').all();
  
  let currentJabatan = '';
  finalPK.forEach(pk => {
    if (pk.jabatan !== currentJabatan) {
      currentJabatan = pk.jabatan;
      console.log(`\n📌 ${currentJabatan}:`);
    }
    console.log(`   ${pk.id}. ${pk.name}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Total PK: ${finalPK.length}`);
  
  // Count by jabatan
  const jabatanCount = {};
  finalPK.forEach(pk => {
    jabatanCount[pk.jabatan] = (jabatanCount[pk.jabatan] || 0) + 1;
  });
  
  console.log('\n📊 Breakdown by Jabatan:');
  Object.entries(jabatanCount).forEach(([jabatan, count]) => {
    console.log(`   ${jabatan}: ${count} PK`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();
console.log('\n✅ Done!');
