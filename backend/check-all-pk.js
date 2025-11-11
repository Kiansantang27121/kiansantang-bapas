import db from './database.js';

console.log('📊 Checking ALL PK (including inactive)...\n');

try {
  const activePK = db.prepare('SELECT COUNT(*) as count FROM pk WHERE is_active = 1').get();
  const inactivePK = db.prepare('SELECT COUNT(*) as count FROM pk WHERE is_active = 0').get();
  const totalPK = db.prepare('SELECT COUNT(*) as count FROM pk').get();
  
  console.log('📈 Statistics:');
  console.log(`   Active PK: ${activePK.count}`);
  console.log(`   Inactive PK: ${inactivePK.count}`);
  console.log(`   Total PK: ${totalPK.count}`);
  console.log('');
  
  if (inactivePK.count > 0) {
    console.log('⚠️  Ada PK yang inactive! Kemungkinan ini sisa dari clear data sebelumnya.');
    console.log('');
    
    const inactive = db.prepare('SELECT id, name, nip FROM pk WHERE is_active = 0 LIMIT 10').all();
    console.log('Sample Inactive PK (first 10):');
    inactive.forEach((pk, i) => {
      console.log(`${i + 1}. ID: ${pk.id} | ${pk.name} | NIP: ${pk.nip || '(kosong)'}`);
    });
  }
  
  console.log('');
  console.log('💡 Kesimpulan:');
  if (activePK.count === 6 && totalPK.count > 6) {
    console.log('   Masalahnya: Banyak PK yang inactive (is_active = 0)');
    console.log('   Solusi: Aktifkan kembali atau hapus permanent');
  } else if (totalPK.count === 6) {
    console.log('   Database memang hanya punya 6 PK total');
    console.log('   Masalahnya: 57 PK lainnya tidak masuk saat sync');
    console.log('   Kemungkinan: Baris di-skip karena nama kosong atau error parsing');
  }
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
