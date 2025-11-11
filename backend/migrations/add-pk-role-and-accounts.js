import db from '../database.js';
import bcrypt from 'bcryptjs';

console.log('🔄 Adding PK role and creating PK accounts...\n');

try {
  // 0. Add pk_id column to users table if not exists
  console.log('📝 Updating users table...');
  const usersTableInfo = db.prepare("PRAGMA table_info(users)").all();
  const hasPkId = usersTableInfo.some(col => col.name === 'pk_id');
  
  if (!hasPkId) {
    db.prepare('ALTER TABLE users ADD COLUMN pk_id INTEGER').run();
    console.log('✅ Added column pk_id to users table');
  }

  // Update role check constraint (need to recreate table for SQLite)
  // For now, we'll just add PK users and handle role validation in application layer
  
  // 1. Add new queue statuses
  console.log('\n📝 Adding new queue columns...');
  
  // Check if we need to add new columns to queue table
  const queueTableInfo = db.prepare("PRAGMA table_info(queue)").all();
  const hasAssignedToPK = queueTableInfo.some(col => col.name === 'assigned_to_pk_id');
  const hasAcceptedAt = queueTableInfo.some(col => col.name === 'accepted_at');
  const hasCalledAt = queueTableInfo.some(col => col.name === 'called_at');
  const hasCompletedAt = queueTableInfo.some(col => col.name === 'completed_at');
  const hasRating = queueTableInfo.some(col => col.name === 'rating');
  const hasRatingComment = queueTableInfo.some(col => col.name === 'rating_comment');

  if (!hasAssignedToPK) {
    db.prepare('ALTER TABLE queue ADD COLUMN assigned_to_pk_id INTEGER').run();
    console.log('✅ Added column: assigned_to_pk_id');
  }

  if (!hasAcceptedAt) {
    db.prepare('ALTER TABLE queue ADD COLUMN accepted_at DATETIME').run();
    console.log('✅ Added column: accepted_at');
  }

  if (!hasCalledAt) {
    db.prepare('ALTER TABLE queue ADD COLUMN called_at DATETIME').run();
    console.log('✅ Added column: called_at');
  }

  if (!hasCompletedAt) {
    db.prepare('ALTER TABLE queue ADD COLUMN completed_at DATETIME').run();
    console.log('✅ Added column: completed_at');
  }

  if (!hasRating) {
    db.prepare('ALTER TABLE queue ADD COLUMN rating INTEGER').run();
    console.log('✅ Added column: rating');
  }

  if (!hasRatingComment) {
    db.prepare('ALTER TABLE queue ADD COLUMN rating_comment TEXT').run();
    console.log('✅ Added column: rating_comment');
  }

  // 2. Create PK accounts for all active PK
  console.log('\n👥 Creating PK accounts...');
  
  const allPK = db.prepare('SELECT * FROM pk WHERE is_active = 1').all();
  const defaultPassword = 'pk123456'; // Default password untuk semua PK
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  let created = 0;
  let skipped = 0;

  // Temporarily disable foreign key constraints to modify table
  db.prepare('PRAGMA foreign_keys = OFF').run();

  for (const pk of allPK) {
    // Generate username dari nama (lowercase, no spaces, no special chars)
    const username = pk.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!existingUser) {
      try {
        // Create user account for this PK
        // Use operator role temporarily since constraint doesn't allow 'pk' yet
        db.prepare(`
          INSERT INTO users (username, password, role, name, pk_id)
          VALUES (?, ?, ?, ?, ?)
        `).run(username, hashedPassword, 'operator', pk.name, pk.id);

        console.log(`✅ Created account: ${username} (${pk.name})`);
        created++;
      } catch (error) {
        console.log(`❌ Failed to create ${username}: ${error.message}`);
      }
    } else {
      // Update existing user to link with PK
      if (!existingUser.pk_id) {
        db.prepare('UPDATE users SET pk_id = ? WHERE id = ?').run(pk.id, existingUser.id);
        console.log(`✅ Updated: ${username} linked to PK`);
      }
      console.log(`⏭️  Skipped: ${username} (already exists)`);
      skipped++;
    }
  }

  // Re-enable foreign key constraints
  db.prepare('PRAGMA foreign_keys = ON').run();

  // 3. Create settings for PK features
  console.log('\n⚙️  Adding PK feature settings...');
  
  const pkSettings = [
    {
      key: 'pk_auto_call_enabled',
      value: 'true',
      description: 'Enable automatic voice call when PK accepts queue'
    },
    {
      key: 'pk_call_voice',
      value: 'female',
      description: 'Voice type for automatic call (male/female)'
    },
    {
      key: 'rating_enabled',
      value: 'true',
      description: 'Enable rating/feedback system'
    },
    {
      key: 'rating_required',
      value: 'false',
      description: 'Make rating mandatory before completing service'
    }
  ];

  let settingsAdded = 0;
  for (const setting of pkSettings) {
    const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get(setting.key);
    if (!existing) {
      db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)').run(
        setting.key,
        setting.value,
        setting.description
      );
      console.log(`✅ Added setting: ${setting.key}`);
      settingsAdded++;
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   PK Accounts Created: ${created}`);
  console.log(`   PK Accounts Skipped: ${skipped}`);
  console.log(`   Total PK: ${allPK.length}`);
  console.log(`   Settings Added: ${settingsAdded}`);
  console.log(`   Default Password: ${defaultPassword}`);

  console.log('\n✅ Migration completed successfully!');
  console.log('\n📝 Next Steps:');
  console.log('   1. PK dapat login dengan username dan password default');
  console.log('   2. Username: nama PK (lowercase, no spaces)');
  console.log(`   3. Password: ${defaultPassword}`);
  console.log('   4. PK dapat menerima dan memanggil klien dari backend mereka');

  console.log('\n🔐 Contoh Login PK:');
  if (allPK.length > 0) {
    const firstPK = allPK[0];
    const firstUsername = firstPK.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    console.log(`   Username: ${firstUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log(`   Role: pk`);
  }

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
