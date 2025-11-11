import db from '../database.js';

console.log('🔄 Adding queue number settings...\n');

try {
  // Add default queue settings if not exists
  const queueSettings = [
    {
      key: 'queue_number_format',
      value: '{prefix}{date}{number}',
      description: 'Format nomor antrian. Variables: {prefix}, {date}, {number}'
    },
    {
      key: 'queue_number_prefix_type',
      value: 'service',
      description: 'Tipe prefix: service (huruf pertama layanan) atau custom'
    },
    {
      key: 'queue_number_custom_prefix',
      value: 'A',
      description: 'Custom prefix jika tipe = custom'
    },
    {
      key: 'queue_number_date_format',
      value: 'YYYYMMDD',
      description: 'Format tanggal: YYYYMMDD, YYMMDD, DDMMYY, atau none'
    },
    {
      key: 'queue_number_digits',
      value: '3',
      description: 'Jumlah digit nomor urut (1-5)'
    },
    {
      key: 'queue_number_separator',
      value: '',
      description: 'Separator antar komponen (kosong, -, ., /)'
    },
    {
      key: 'queue_reset_daily',
      value: 'true',
      description: 'Reset nomor antrian setiap hari'
    },
    {
      key: 'queue_start_number',
      value: '1',
      description: 'Nomor awal antrian (default 1)'
    }
  ];

  let added = 0;
  let skipped = 0;

  for (const setting of queueSettings) {
    const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get(setting.key);
    
    if (!existing) {
      db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)').run(
        setting.key,
        setting.value,
        setting.description
      );
      console.log(`✅ Added: ${setting.key} = ${setting.value}`);
      added++;
    } else {
      console.log(`⏭️  Skipped: ${setting.key} (already exists)`);
      skipped++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Added: ${added}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${queueSettings.length}`);

  console.log('\n✅ Queue settings migration completed!');
  console.log('\n📝 Settings yang ditambahkan:');
  console.log('   - Format nomor antrian');
  console.log('   - Tipe prefix (service/custom)');
  console.log('   - Custom prefix');
  console.log('   - Format tanggal');
  console.log('   - Jumlah digit');
  console.log('   - Separator');
  console.log('   - Reset harian');
  console.log('   - Nomor awal');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
