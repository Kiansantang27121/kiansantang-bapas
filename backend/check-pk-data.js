import db from './database.js';

console.log('📊 Checking PK Data in Database...\n');

try {
  // Get all active PK
  const pks = db.prepare('SELECT id, name, nip, phone, jabatan FROM pk WHERE is_active = 1 ORDER BY name').all();
  
  console.log(`Total Active PK: ${pks.length}\n`);
  
  console.log('Sample Data (First 10):');
  console.log('─'.repeat(80));
  
  pks.slice(0, 10).forEach((pk, index) => {
    console.log(`${index + 1}. ${pk.name}`);
    console.log(`   NIP: ${pk.nip || '(kosong)'}`);
    console.log(`   Telepon: ${pk.phone || '(kosong)'}`);
    console.log(`   Jabatan: ${pk.jabatan || '(kosong)'}`);
    console.log('');
  });
  
  // Check for issues
  console.log('\n🔍 Checking for Issues:');
  console.log('─'.repeat(80));
  
  const noNIP = pks.filter(pk => !pk.nip || pk.nip.trim() === '');
  const noJabatan = pks.filter(pk => !pk.jabatan || pk.jabatan.trim() === '');
  const noPhone = pks.filter(pk => !pk.phone || pk.phone.trim() === '');
  
  console.log(`PK tanpa NIP: ${noNIP.length}`);
  console.log(`PK tanpa Jabatan: ${noJabatan.length}`);
  console.log(`PK tanpa Telepon: ${noPhone.length}`);
  
  // Check for duplicate names
  const nameCount = {};
  pks.forEach(pk => {
    nameCount[pk.name] = (nameCount[pk.name] || 0) + 1;
  });
  
  const duplicates = Object.entries(nameCount).filter(([name, count]) => count > 1);
  if (duplicates.length > 0) {
    console.log(`\n⚠️  Duplicate Names Found: ${duplicates.length}`);
    duplicates.forEach(([name, count]) => {
      console.log(`   - "${name}" appears ${count} times`);
    });
  }
  
  // Check NIP format issues
  const nipIssues = pks.filter(pk => pk.nip && pk.nip.length < 18);
  if (nipIssues.length > 0) {
    console.log(`\n⚠️  NIP Format Issues: ${nipIssues.length}`);
    nipIssues.slice(0, 5).forEach(pk => {
      console.log(`   - ${pk.name}: NIP = "${pk.nip}" (length: ${pk.nip.length})`);
    });
  }
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
