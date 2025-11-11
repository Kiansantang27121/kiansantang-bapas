import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('🔧 Updating PK jabatan manually...\n');

// Update specific PK with correct jabatan
// Format: { name: 'Nama PK', jabatan: 'Jabatan' }
const updates = [
  // APK (Ahli Pembimbing Kemasyarakatan)
  { name: 'Budi Santoso, S.Sos', jabatan: 'APK' },
  { name: 'Siti Nurhaliza, S.H.', jabatan: 'APK' },
  
  // PK Madya
  { name: 'Ahmad Fauzi, S.Psi', jabatan: 'PK Madya' },
  { name: 'Dewi Lestari, S.Sos', jabatan: 'PK Madya' },
  { name: 'Rudi Hermawan, S.H.', jabatan: 'PK Madya' },
  { name: 'Budiana', jabatan: 'PK Madya' },
  { name: 'Ryan Rizkia', jabatan: 'PK Madya' },
  { name: 'Muhamad Anggiansah', jabatan: 'PK Madya' },
  { name: 'Rakha Hafiyan', jabatan: 'PK Madya' },
  { name: 'Kania Rafinda', jabatan: 'PK Madya' },
  
  // PK Muda
  { name: 'Dina Anggun Wahyuni', jabatan: 'PK Muda' },
  { name: 'Iyus Yusuf', jabatan: 'PK Muda' },
  { name: 'Adhani Wardianti', jabatan: 'PK Muda' },
  { name: 'Hari Terbit Matahari', jabatan: 'PK Muda' },
  { name: 'Mahyudi', jabatan: 'PK Muda' },
  { name: 'Achmad Hidayat', jabatan: 'PK Muda' },
  { name: 'Ati Ekawati', jabatan: 'PK Muda' },
  { name: 'Uan Kurniawan N', jabatan: 'PK Muda' },
  { name: 'Adrian', jabatan: 'PK Muda' },
  { name: 'Rima Khuriatul Rahmatilah', jabatan: 'PK Muda' },
  
  // Rest will remain as PK Pertama
];

console.log('📝 Updating jabatan for specific PK...\n');

updates.forEach(update => {
  try {
    const result = db.prepare('UPDATE pk SET jabatan = ? WHERE name = ?').run(update.jabatan, update.name);
    if (result.changes > 0) {
      console.log(`✅ ${update.name} → ${update.jabatan}`);
    } else {
      console.log(`⚠️  ${update.name} → Not found`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${update.name}:`, error.message);
  }
});

console.log('\n📊 Final PK list grouped by jabatan:');
console.log('═══════════════════════════════════════════════════════════');

const finalPK = db.prepare('SELECT id, name, jabatan FROM pk ORDER BY jabatan, name').all();

let currentJabatan = '';
let count = 0;

finalPK.forEach(pk => {
  if (pk.jabatan !== currentJabatan) {
    if (currentJabatan) {
      console.log(`   Total: ${count} PK\n`);
    }
    currentJabatan = pk.jabatan;
    count = 0;
    console.log(`📌 ${currentJabatan}:`);
  }
  count++;
  console.log(`   ${count}. ${pk.name}`);
});

console.log(`   Total: ${count} PK\n`);

console.log('═══════════════════════════════════════════════════════════');

// Count by jabatan
const jabatanCount = {};
finalPK.forEach(pk => {
  jabatanCount[pk.jabatan] = (jabatanCount[pk.jabatan] || 0) + 1;
});

console.log('\n📊 Summary by Jabatan:');
Object.entries(jabatanCount).sort().forEach(([jabatan, count]) => {
  console.log(`   ${jabatan}: ${count} PK`);
});

console.log(`\n✅ Total PK: ${finalPK.length}`);

db.close();
console.log('\n✅ Done!');
