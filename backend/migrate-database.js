import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const oldDbPath = join(__dirname, 'bapas.db.backup');
const newDbPath = join(__dirname, 'bapas.db');

if (!fs.existsSync(oldDbPath)) {
  console.error('❌ Backup database not found: bapas.db.backup');
  console.log('   Cannot perform migration without backup file.');
  process.exit(1);
}

console.log('🔄 Starting database migration...\n');

// Open both databases
const oldDb = new Database(oldDbPath, { readonly: true });
const newDb = new Database(newDbPath);

// Disable foreign keys for migration
newDb.pragma('foreign_keys = OFF');

try {
  // Migrate Users
  console.log('👥 Migrating users...');
  const users = oldDb.prepare('SELECT * FROM users').all();
  const insertUser = newDb.prepare(
    'INSERT INTO users (id, username, password, role, name, pk_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  
  for (const user of users) {
    try {
      insertUser.run(
        user.id,
        user.username,
        user.password,
        user.role,
        user.name,
        user.pk_id || null,
        user.created_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping duplicate user: ${user.username}`);
    }
  }
  console.log(`   ✅ Migrated ${users.length} users\n`);

  // Migrate Services
  console.log('📋 Migrating services...');
  const services = oldDb.prepare('SELECT * FROM services').all();
  const insertService = newDb.prepare(
    'INSERT INTO services (id, name, description, estimated_time, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  for (const service of services) {
    try {
      insertService.run(
        service.id,
        service.name,
        service.description,
        service.estimated_time,
        service.is_active,
        service.created_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping duplicate service: ${service.name}`);
    }
  }
  console.log(`   ✅ Migrated ${services.length} services\n`);

  // Migrate PK
  console.log('👨‍💼 Migrating PK (Pembimbing Kemasyarakatan)...');
  const pks = oldDb.prepare('SELECT * FROM pk').all();
  const insertPK = newDb.prepare(
    'INSERT INTO pk (id, name, nip, phone, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  for (const pk of pks) {
    try {
      insertPK.run(
        pk.id,
        pk.name,
        pk.nip,
        pk.phone,
        pk.is_active,
        pk.created_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping duplicate PK: ${pk.name}`);
    }
  }
  console.log(`   ✅ Migrated ${pks.length} PK\n`);

  // Migrate Clients
  console.log('👤 Migrating clients...');
  const clients = oldDb.prepare('SELECT * FROM clients').all();
  const insertClient = newDb.prepare(
    'INSERT INTO clients (id, name, nik, phone, address, pk_id, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  for (const client of clients) {
    try {
      insertClient.run(
        client.id,
        client.name,
        client.nik,
        client.phone,
        client.address,
        client.pk_id,
        client.is_active,
        client.created_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping duplicate client: ${client.name}`);
    }
  }
  console.log(`   ✅ Migrated ${clients.length} clients\n`);

  // Migrate Counters
  console.log('🏪 Migrating counters...');
  const counters = oldDb.prepare('SELECT * FROM counters').all();
  const insertCounter = newDb.prepare(
    'INSERT INTO counters (id, counter_number, name, is_active, operator_id, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  
  for (const counter of counters) {
    try {
      insertCounter.run(
        counter.id,
        counter.counter_number,
        counter.name,
        counter.is_active,
        counter.operator_id,
        counter.created_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping duplicate counter: ${counter.name}`);
    }
  }
  console.log(`   ✅ Migrated ${counters.length} counters\n`);

  // Migrate Settings
  console.log('⚙️  Migrating settings...');
  const settings = oldDb.prepare('SELECT * FROM settings').all();
  const insertSetting = newDb.prepare(
    'INSERT OR REPLACE INTO settings (key, value, description, updated_at) VALUES (?, ?, ?, ?)'
  );
  
  for (const setting of settings) {
    insertSetting.run(
      setting.key,
      setting.value,
      setting.description,
      setting.updated_at
    );
  }
  console.log(`   ✅ Migrated ${settings.length} settings\n`);

  // Migrate Queue (with new columns)
  console.log('🎫 Migrating queue...');
  const queues = oldDb.prepare('SELECT * FROM queue').all();
  
  // Check if old queue table has pk_id and client_id columns
  const oldQueueColumns = oldDb.prepare("PRAGMA table_info(queue)").all();
  const hasPkId = oldQueueColumns.some(col => col.name === 'pk_id');
  const hasClientId = oldQueueColumns.some(col => col.name === 'client_id');
  
  const insertQueue = newDb.prepare(
    'INSERT INTO queue (id, queue_number, service_id, client_name, client_phone, client_nik, pk_id, client_id, status, counter_number, operator_id, notes, created_at, called_at, serving_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  for (const queue of queues) {
    try {
      insertQueue.run(
        queue.id,
        queue.queue_number,
        queue.service_id,
        queue.client_name,
        queue.client_phone,
        queue.client_nik,
        hasPkId ? queue.pk_id : null,
        hasClientId ? queue.client_id : null,
        queue.status,
        queue.counter_number,
        queue.operator_id,
        queue.notes,
        queue.created_at,
        queue.called_at,
        queue.serving_at,
        queue.completed_at
      );
    } catch (err) {
      console.log(`   ⚠️  Skipping queue: ${queue.queue_number} - ${err.message}`);
    }
  }
  console.log(`   ✅ Migrated ${queues.length} queue records\n`);

  // Check for workflow table
  const tables = oldDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const hasWorkflow = tables.some(t => t.name === 'workflow');
  
  if (hasWorkflow) {
    console.log('📊 Migrating workflow...');
    const workflows = oldDb.prepare('SELECT * FROM workflow').all();
    
    // Create workflow table if not exists
    newDb.exec(`
      CREATE TABLE IF NOT EXISTS workflow (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        queue_id INTEGER NOT NULL,
        pk_id INTEGER NOT NULL,
        client_id INTEGER,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME,
        completed_at DATETIME,
        FOREIGN KEY (queue_id) REFERENCES queue(id),
        FOREIGN KEY (pk_id) REFERENCES pk(id),
        FOREIGN KEY (client_id) REFERENCES clients(id)
      )
    `);
    
    const insertWorkflow = newDb.prepare(
      'INSERT INTO workflow (id, queue_id, pk_id, client_id, status, notes, created_at, approved_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    
    for (const workflow of workflows) {
      try {
        insertWorkflow.run(
          workflow.id,
          workflow.queue_id,
          workflow.pk_id,
          workflow.client_id,
          workflow.status,
          workflow.notes,
          workflow.created_at,
          workflow.approved_at,
          workflow.completed_at
        );
      } catch (err) {
        console.log(`   ⚠️  Skipping workflow: ${workflow.id} - ${err.message}`);
      }
    }
    console.log(`   ✅ Migrated ${workflows.length} workflow records\n`);
  }

  console.log('✅ Migration completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Services: ${services.length}`);
  console.log(`   - PK: ${pks.length}`);
  console.log(`   - Clients: ${clients.length}`);
  console.log(`   - Counters: ${counters.length}`);
  console.log(`   - Settings: ${settings.length}`);
  console.log(`   - Queue: ${queues.length}`);
  if (hasWorkflow) {
    const workflows = oldDb.prepare('SELECT * FROM workflow').all();
    console.log(`   - Workflow: ${workflows.length}`);
  }
  console.log('');
  console.log('🔄 Please restart the backend server.');
  console.log('   Run: npm run dev');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error(error);
  process.exit(1);
} finally {
  oldDb.close();
  newDb.close();
}
