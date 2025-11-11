import db from './database.js';

console.log('🔧 Cleaning and Fixing PK Data...\n');

try {
  // Step 1: Find and remove duplicates (keep the one with proper NIP format)
  console.log('Step 1: Removing Duplicates...');
  console.log('─'.repeat(80));
  
  const duplicateNames = [
    'Dina Anggun Wahyuni',
    'Kania Rafinda',
    'Muhamad Anggiansah',
    'Rakha Hafiyan',
    'Ryan Rizkia'
  ];
  
  let removed = 0;
  
  for (const name of duplicateNames) {
    const records = db.prepare('SELECT * FROM pk WHERE name = ? AND is_active = 1 ORDER BY id').all(name);
    
    if (records.length > 1) {
      console.log(`\nFound ${records.length} records for "${name}":`);
      
      // Find the one with proper 18-digit NIP
      const properRecord = records.find(r => r.nip && r.nip.length === 18 && /^\d+$/.test(r.nip));
      
      if (properRecord) {
        console.log(`  ✅ Keeping ID ${properRecord.id} (NIP: ${properRecord.nip})`);
        
        // Remove others
        for (const record of records) {
          if (record.id !== properRecord.id) {
            db.prepare('UPDATE pk SET is_active = 0 WHERE id = ?').run(record.id);
            console.log(`  ❌ Removed ID ${record.id} (NIP: ${record.nip || 'none'})`);
            removed++;
          }
        }
      } else {
        // Keep the first one
        console.log(`  ⚠️  No proper NIP found, keeping first record ID ${records[0].id}`);
        for (let i = 1; i < records.length; i++) {
          db.prepare('UPDATE pk SET is_active = 0 WHERE id = ?').run(records[i].id);
          console.log(`  ❌ Removed ID ${records[i].id}`);
          removed++;
        }
      }
    }
  }
  
  console.log(`\n✅ Removed ${removed} duplicate records\n`);
  
  // Step 2: Fix column swaps
  console.log('\nStep 2: Fixing Column Swaps...');
  console.log('─'.repeat(80));
  
  const pks = db.prepare('SELECT * FROM pk WHERE is_active = 1').all();
  let fixed = 0;
  
  for (const pk of pks) {
    // Detect if NIP contains gelar (should be 18 digits)
    if (pk.nip && pk.nip.length < 10 && (pk.nip.includes('.') || pk.nip.includes('S.') || pk.nip.includes('A.'))) {
      // NIP contains gelar, likely swapped
      if (pk.phone && pk.phone.length === 18 && /^\d+$/.test(pk.phone)) {
        // Phone looks like NIP (18 digits)
        const newData = {
          jabatan: pk.nip,  // Gelar goes to jabatan
          nip: pk.phone,    // Real NIP from phone
          phone: pk.jabatan // Real phone from jabatan
        };
        
        console.log(`\nFixing: ${pk.name}`);
        console.log(`  OLD: NIP="${pk.nip}" | Phone="${pk.phone}" | Jabatan="${pk.jabatan}"`);
        console.log(`  NEW: NIP="${newData.nip}" | Phone="${newData.phone}" | Jabatan="${newData.jabatan}"`);
        
        db.prepare('UPDATE pk SET nip = ?, phone = ?, jabatan = ? WHERE id = ?').run(
          newData.nip || null,
          newData.phone || null,
          newData.jabatan || null,
          pk.id
        );
        fixed++;
      }
    }
  }
  
  console.log(`\n✅ Fixed ${fixed} records with column swaps\n`);
  
  // Step 3: Show final stats
  console.log('\nStep 3: Final Statistics...');
  console.log('─'.repeat(80));
  
  const final = db.prepare('SELECT * FROM pk WHERE is_active = 1').all();
  const properNIP = final.filter(pk => pk.nip && pk.nip.length === 18 && /^\d+$/.test(pk.nip));
  const noNIP = final.filter(pk => !pk.nip || pk.nip.trim() === '');
  const gelarInNIP = final.filter(pk => pk.nip && pk.nip.length < 10);
  
  console.log(`Total Active PK: ${final.length}`);
  console.log(`  ✅ With proper NIP (18 digits): ${properNIP.length}`);
  console.log(`  ⚠️  Without NIP: ${noNIP.length}`);
  console.log(`  ⚠️  With gelar in NIP: ${gelarInNIP.length}`);
  
  // Show sample
  console.log('\n📋 Sample Data (First 5):');
  console.log('─'.repeat(80));
  const sample = db.prepare('SELECT * FROM pk WHERE is_active = 1 ORDER BY name LIMIT 5').all();
  sample.forEach((pk, index) => {
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
