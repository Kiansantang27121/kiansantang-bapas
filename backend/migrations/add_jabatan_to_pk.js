import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(dirname(__dirname), 'bapas.db'));

// Add jabatan column to pk table if it doesn't exist
try {
  const tableInfo = db.prepare("PRAGMA table_info(pk)").all();
  const hasJabatan = tableInfo.some(col => col.name === 'jabatan');

  if (!hasJabatan) {
    console.log('Adding jabatan column to pk table...');
    db.exec('ALTER TABLE pk ADD COLUMN jabatan TEXT');
    console.log('✅ jabatan column added');
    
    // Update existing PK with default jabatan
    console.log('Updating existing PK with jabatan...');
    db.prepare('UPDATE pk SET jabatan = ? WHERE id = 1').run('Pembimbing Kemasyarakatan Ahli Muda');
    db.prepare('UPDATE pk SET jabatan = ? WHERE id = 2').run('Pembimbing Kemasyarakatan Ahli Madya');
    db.prepare('UPDATE pk SET jabatan = ? WHERE id = 3').run('Pembimbing Kemasyarakatan Ahli Muda');
    db.prepare('UPDATE pk SET jabatan = ? WHERE id = 4').run('Pembimbing Kemasyarakatan Ahli Pertama');
    db.prepare('UPDATE pk SET jabatan = ? WHERE id = 5').run('Pembimbing Kemasyarakatan Ahli Madya');
    console.log('✅ Jabatan updated for existing PK');
  } else {
    console.log('jabatan column already exists');
  }

  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration error:', error);
  process.exit(1);
}

db.close();
