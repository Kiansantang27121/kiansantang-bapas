import db from './database.js';

console.log('📊 Checking Sync Result...\n');

try {
  const pks = db.prepare('SELECT * FROM pk WHERE is_active = 1 ORDER BY id DESC').all();
  
  console.log(`Total PK di database: ${pks.length}\n`);
  
  if (pks.length === 0) {
    console.log('❌ Tidak ada PK di database!');
    console.log('Kemungkinan sync gagal atau belum dilakukan.\n');
  } else {
    console.log('Data PK yang berhasil masuk:');
    console.log('─'.repeat(80));
    
    pks.forEach((pk, i) => {
      console.log(`${i + 1}. ${pk.name}`);
      console.log(`   NIP: ${pk.nip || '(kosong)'}`);
      console.log(`   Telepon: ${pk.phone || '(kosong)'}`);
      console.log(`   Jabatan: ${pk.jabatan || '(kosong)'}`);
      console.log('');
    });
    
    // Check for issues
    console.log('🔍 Analisis:');
    console.log('─'.repeat(80));
    
    const withNIP = pks.filter(pk => pk.nip && pk.nip.trim() !== '');
    const withPhone = pks.filter(pk => pk.phone && pk.phone.trim() !== '');
    const withJabatan = pks.filter(pk => pk.jabatan && pk.jabatan.trim() !== '');
    
    console.log(`✅ PK dengan NIP: ${withNIP.length}/${pks.length}`);
    console.log(`✅ PK dengan Telepon: ${withPhone.length}/${pks.length}`);
    console.log(`✅ PK dengan Jabatan: ${withJabatan.length}/${pks.length}`);
    
    if (pks.length < 10) {
      console.log('\n⚠️  WARNING: Hanya sedikit PK yang masuk!');
      console.log('Kemungkinan penyebab:');
      console.log('1. Google Sheets hanya berisi sedikit data');
      console.log('2. Banyak baris kosong atau error saat parsing');
      console.log('3. Format data tidak sesuai');
    }
  }
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
