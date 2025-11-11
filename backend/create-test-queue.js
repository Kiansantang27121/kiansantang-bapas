import db from './database.js';

// Create test queue for Bimbingan Wajib Lapor
try {
  // Get Bimbingan Wajib Lapor service
  const service = db.prepare("SELECT * FROM services WHERE name LIKE '%Bimbingan Wajib Lapor%'").get();
  
  if (!service) {
    console.log('❌ Service Bimbingan Wajib Lapor not found');
    console.log('Creating service...');
    
    const result = db.prepare(`
      INSERT INTO services (name, description, estimated_time, is_active)
      VALUES (?, ?, ?, ?)
    `).run('Bimbingan Wajib Lapor', 'Layanan bimbingan wajib lapor untuk klien', 30, 1);
    
    console.log('✅ Service created with ID:', result.lastInsertRowid);
  } else {
    console.log('✅ Service found:', service.name, '(ID:', service.id + ')');
  }

  // Get service again
  const bwlService = db.prepare("SELECT * FROM services WHERE name LIKE '%Bimbingan Wajib Lapor%'").get();

  // Create test queues
  const testQueues = [
    { name: 'Abdul Rahman', phone: '081234567890', nik: '3201234567890001' },
    { name: 'Siti Nurhaliza', phone: '081234567891', nik: '3201234567890002' },
    { name: 'Budi Santoso', phone: '081234567892', nik: '3201234567890003' },
    { name: 'Dewi Lestari', phone: '081234567893', nik: '3201234567890004' },
    { name: 'Ahmad Fauzi', phone: '081234567894', nik: '3201234567890005' }
  ];

  console.log('\n📋 Creating test queues...\n');

  testQueues.forEach((client, index) => {
    const queueNumber = `A${String(index + 1).padStart(3, '0')}`;
    
    try {
      const result = db.prepare(`
        INSERT INTO queue (queue_number, service_id, client_name, client_phone, client_nik, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(queueNumber, bwlService.id, client.name, client.phone, client.nik, 'waiting');
      
      console.log(`✅ Created queue ${queueNumber} for ${client.name}`);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint')) {
        console.log(`⚠️  Queue ${queueNumber} already exists`);
      } else {
        console.error(`❌ Error creating queue ${queueNumber}:`, error.message);
      }
    }
  });

  console.log('\n✅ Test queues created successfully!');
  console.log('\n📊 Current queues:');
  
  const queues = db.prepare(`
    SELECT q.*, s.name as service_name
    FROM queue q
    JOIN services s ON q.service_id = s.id
    WHERE q.status = 'waiting'
    ORDER BY q.created_at DESC
  `).all();
  
  queues.forEach(q => {
    console.log(`   ${q.queue_number} - ${q.client_name} (${q.service_name})`);
  });

} catch (error) {
  console.error('❌ Error:', error);
}
