import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'bapas.db'));

// Disable foreign keys temporarily to allow queue insertion with pk_id and client_id
// TODO: Re-enable after proper database migration
db.pragma('foreign_keys = OFF');

// Initialize database tables
export async function initDatabase() {
  // Users table (admin, operators & petugas)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'operator', 'petugas_layanan', 'pk', 'struktural')),
      name TEXT NOT NULL,
      pk_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pk_id) REFERENCES pk(id)
    )
  `);

  // Services table (jenis layanan)
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      estimated_time INTEGER DEFAULT 30,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Queue table (antrian layanan)
  db.exec(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_number TEXT UNIQUE NOT NULL,
      service_id INTEGER NOT NULL,
      client_name TEXT NOT NULL,
      client_phone TEXT,
      client_nik TEXT,
      pk_id INTEGER,
      client_id INTEGER,
      status TEXT NOT NULL DEFAULT 'waiting' CHECK(status IN ('waiting', 'called', 'serving', 'completed', 'cancelled')),
      counter_number INTEGER,
      operator_id INTEGER,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      called_at DATETIME,
      serving_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (operator_id) REFERENCES users(id),
      FOREIGN KEY (pk_id) REFERENCES pk(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  // Counters table (loket)
  db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      counter_number INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      operator_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (operator_id) REFERENCES users(id)
    )
  `);

  // Settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // PK (Pembimbing Kemasyarakatan) table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pk (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nip TEXT UNIQUE,
      phone TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clients table (Klien binaan)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nik TEXT UNIQUE,
      phone TEXT,
      address TEXT,
      pk_id INTEGER,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pk_id) REFERENCES pk(id)
    )
  `);

  // Insert default admin if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!adminExists) {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    db.prepare('INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)').run(
      'admin',
      hashedPassword,
      'admin',
      'Administrator'
    );
  }

  // Insert default services if not exists
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCount.count === 0) {
    const insertService = db.prepare('INSERT INTO services (name, description, estimated_time) VALUES (?, ?, ?)');
    insertService.run('Bimbingan Wajib Lapor', 'Layanan bimbingan dan wajib lapor klien binaan', 15);
    insertService.run('Pendaftaran Klien Baru', 'Pendaftaran untuk klien baru BAPAS', 30);
    insertService.run('Konsultasi', 'Layanan konsultasi dengan petugas', 20);
    insertService.run('Pelaporan', 'Pelaporan rutin klien', 15);
    insertService.run('Administrasi', 'Layanan administrasi umum', 25);
  }

  // Insert default PK if not exists
  const pkCount = db.prepare('SELECT COUNT(*) as count FROM pk').get();
  if (pkCount.count === 0) {
    const insertPK = db.prepare('INSERT INTO pk (name, nip, phone) VALUES (?, ?, ?)');
    insertPK.run('Budi Santoso, S.Sos', '198501012010011001', '081234567890');
    insertPK.run('Siti Nurhaliza, S.H.', '198702022011012002', '081234567891');
    insertPK.run('Ahmad Fauzi, S.Psi', '198903032012011003', '081234567892');
    insertPK.run('Dewi Lestari, S.Sos', '199004042013012004', '081234567893');
    insertPK.run('Rudi Hermawan, S.H.', '199105052014011005', '081234567894');
  }

  // Insert sample clients if not exists (skip - will be added via Management UI or Google Sheets sync)
  // Sample clients removed to avoid foreign key constraint issues when PK data is cleared

  // Migration: Add pk_id and client_id columns to queue table if they don't exist
  try {
    const tableInfo = db.prepare("PRAGMA table_info(queue)").all();
    const hasPkId = tableInfo.some(col => col.name === 'pk_id');
    const hasClientId = tableInfo.some(col => col.name === 'client_id');
    
    if (!hasPkId) {
      console.log('Adding pk_id column to queue table...');
      // Disable foreign keys temporarily for migration
      db.pragma('foreign_keys = OFF');
      db.exec('ALTER TABLE queue ADD COLUMN pk_id INTEGER');
      db.pragma('foreign_keys = ON');
    }
    
    if (!hasClientId) {
      console.log('Adding client_id column to queue table...');
      // Disable foreign keys temporarily for migration
      db.pragma('foreign_keys = OFF');
      db.exec('ALTER TABLE queue ADD COLUMN client_id INTEGER');
      db.pragma('foreign_keys = ON');
    }
  } catch (error) {
    console.error('Migration error:', error.message);
  }

  // Insert default counters if not exists
  const countersCount = db.prepare('SELECT COUNT(*) as count FROM counters').get();
  if (countersCount.count === 0) {
    const insertCounter = db.prepare('INSERT INTO counters (counter_number, name) VALUES (?, ?)');
    insertCounter.run(1, 'Loket 1');
    insertCounter.run(2, 'Loket 2');
    insertCounter.run(3, 'Loket 3');
  }

  // Insert default settings
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)');
    insertSetting.run('office_name', 'BAPAS Bandung', 'Nama kantor');
    insertSetting.run('office_address', 'Jl. Contoh No. 123, Bandung', 'Alamat kantor');
    insertSetting.run('office_phone', '022-1234567', 'Nomor telepon kantor');
    insertSetting.run('working_hours', '08:00 - 16:00', 'Jam operasional');
    insertSetting.run('display_refresh_interval', '5000', 'Interval refresh display (ms)');
    insertSetting.run('logo_url', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Logo_Kementerian_Hukum_dan_HAM.svg/200px-Logo_Kementerian_Hukum_dan_HAM.svg.png', 'URL logo instansi');
    insertSetting.run('video_url', '', 'URL video display');
    insertSetting.run('running_text', 'Selamat datang di BAPAS Bandung - Melayani dengan sepenuh hati', 'Running text display');
    insertSetting.run('running_text_2', 'Jam Pelayanan: Senin - Jumat, 08:00 - 16:00 WIB', 'Running text 2');
    insertSetting.run('running_text_3', 'Hubungi kami: 022-1234567 | Email: info@bapasbandung.go.id', 'Running text 3');
    insertSetting.run('display_layout', 'modern', 'Layout display (modern/classic)');
    insertSetting.run('display_columns', '4', 'Jumlah kolom loket preview (2/3/4)');
    insertSetting.run('show_statistics', 'true', 'Tampilkan statistik di display');
    insertSetting.run('statistics_position', 'bottom', 'Posisi statistik (top/bottom/sidebar)');
    insertSetting.run('theme_border_color', '#06b6d4', 'Warna border display (cyan)');
    insertSetting.run('theme_header_from', '#06b6d4', 'Warna header gradient dari (cyan)');
    insertSetting.run('theme_header_to', '#14b8a6', 'Warna header gradient ke (teal)');
    insertSetting.run('theme_panel_from', '#1f2937', 'Warna panel gradient dari (gray-800)');
    insertSetting.run('theme_panel_to', '#111827', 'Warna panel gradient ke (gray-900)');
    insertSetting.run('theme_running_from', '#dc2626', 'Warna running text gradient dari (red)');
    insertSetting.run('theme_running_to', '#ea580c', 'Warna running text gradient ke (orange)');
    insertSetting.run('theme_queue_number', '#facc15', 'Warna nomor antrian (yellow)');
    insertSetting.run('theme_accent', '#06b6d4', 'Warna accent (cyan)');
  }

  console.log('Database initialized successfully');
}

export default db;
