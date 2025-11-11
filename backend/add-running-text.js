import db from './database.js';

console.log('🔄 Adding running text setting...');

try {
  // Check if running_text already exists
  const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get('running_text');
  
  if (existing) {
    console.log('ℹ️  Running text setting already exists:', existing.value);
  } else {
    // Add running text setting
    db.prepare(
      'INSERT INTO settings (key, value, description) VALUES (?, ?, ?)'
    ).run(
      'running_text',
      'Selamat datang di KIANSANTANG - Kios Antrian Santun dan Tanggap | BAPAS Kelas I Bandung | Layanan Cepat, Santun, dan Profesional',
      'Running text yang ditampilkan di halaman utama'
    );
    
    console.log('✅ Running text setting added successfully');
  }
  
  // Display current setting
  const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get('running_text');
  console.log('\n📝 Current running text:');
  console.log('   Key:', setting.key);
  console.log('   Value:', setting.value);
  console.log('   Description:', setting.description);
  
} catch (error) {
  console.error('❌ Error adding running text:', error);
  process.exit(1);
}

console.log('\n✅ Done!');
