import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

console.log('📋 Checking PK data with jabatan...\n');

const pks = db.prepare('SELECT id, name, nip, jabatan, phone FROM pk ORDER BY name').all();

console.log('═══════════════════════════════════════════════════════════');
console.log(`Total PK: ${pks.length}\n`);

pks.forEach(pk => {
  console.log(`ID: ${pk.id}`);
  console.log(`Nama: ${pk.name}`);
  console.log(`NIP: ${pk.nip || '-'}`);
  console.log(`Jabatan: ${pk.jabatan || '❌ TIDAK ADA'}`);
  console.log(`Phone: ${pk.phone || '-'}`);
  console.log('-----------------------------------------------------------');
});

console.log('═══════════════════════════════════════════════════════════');

// Count PK with and without jabatan
const withJabatan = pks.filter(pk => pk.jabatan).length;
const withoutJabatan = pks.filter(pk => !pk.jabatan).length;

console.log(`\n✅ PK dengan jabatan: ${withJabatan}`);
console.log(`❌ PK tanpa jabatan: ${withoutJabatan}`);

if (withoutJabatan > 0) {
  console.log('\n⚠️  Ada PK yang belum memiliki jabatan!');
  console.log('💡 Jalankan script update-pk-jabatan.js untuk menambahkan jabatan');
}

db.close();
