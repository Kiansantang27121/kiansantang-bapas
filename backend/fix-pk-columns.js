import db from './database.js';

console.log('🔧 Fixing PK Column Data...\n');

try {
  // Get all PK with potential column swap issues
  const pks = db.prepare('SELECT * FROM pk WHERE is_active = 1').all();
  
  let fixed = 0;
  let skipped = 0;
  
  console.log(`Checking ${pks.length} PK records...\n`);
  
  for (const pk of pks) {
    let needsFix = false;
    let newData = {
      name: pk.name,
      nip: pk.nip,
      phone: pk.phone,
      jabatan: pk.jabatan
    };
    
    // Detect if NIP contains gelar (should be 18 digits)
    if (pk.nip && pk.nip.length < 10 && (pk.nip.includes('.') || pk.nip.includes('S.') || pk.nip.includes('A.'))) {
      // NIP contains gelar, likely swapped
      // Pattern: NIP has gelar, Phone has real NIP, Jabatan has phone
      if (pk.phone && pk.phone.length === 18 && /^\d+$/.test(pk.phone)) {
        // Phone looks like NIP (18 digits)
        needsFix = true;
        newData.jabatan = pk.nip;  // Gelar goes to jabatan
        newData.nip = pk.phone;    // Real NIP from phone
        newData.phone = pk.jabatan; // Real phone from jabatan
        
        console.log(`Fixing: ${pk.name}`);
        console.log(`  OLD: NIP="${pk.nip}" | Phone="${pk.phone}" | Jabatan="${pk.jabatan}"`);
        console.log(`  NEW: NIP="${newData.nip}" | Phone="${newData.phone}" | Jabatan="${newData.jabatan}"`);
        console.log('');
      }
    }
    
    if (needsFix) {
      try {
        // Check if NIP already exists in another record
        const existing = db.prepare('SELECT id FROM pk WHERE nip = ? AND id != ?').get(newData.nip, pk.id);
        if (existing) {
          console.log(`  ⚠️  Skipped: NIP already exists in another record`);
          console.log('');
          skipped++;
        } else {
          db.prepare('UPDATE pk SET nip = ?, phone = ?, jabatan = ? WHERE id = ?').run(
            newData.nip || null,
            newData.phone || null,
            newData.jabatan || null,
            pk.id
          );
          fixed++;
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        console.log('');
        skipped++;
      }
    } else {
      skipped++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Fixed: ${fixed} records`);
  console.log(`⏭️  Skipped: ${skipped} records (already correct)`);
  
  // Show sample after fix
  console.log('\n📋 Sample Data After Fix (First 5):');
  console.log('─'.repeat(80));
  const updated = db.prepare('SELECT id, name, nip, phone, jabatan FROM pk WHERE is_active = 1 ORDER BY name LIMIT 5').all();
  updated.forEach((pk, index) => {
    console.log(`${index + 1}. ${pk.name}`);
    console.log(`   NIP: ${pk.nip || '(kosong)'}`);
    console.log(`   Telepon: ${pk.phone || '(kosong)'}`);
    console.log(`   Jabatan: ${pk.jabatan || '(kosong)'}`);
    console.log('');
  });
  
  console.log('✅ Done! Refresh Management PK untuk melihat data yang benar.');
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
