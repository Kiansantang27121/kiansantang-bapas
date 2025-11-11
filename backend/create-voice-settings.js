import db from './database.js';

console.log('🔧 CREATING VOICE SETTINGS\n');
console.log('='.repeat(80));

// Check if settings exist for voice
console.log('\n📋 Step 1: Checking voice settings...\n');

const voiceSettings = [
  { key: 'voice_enabled', value: 'true', description: 'Enable/disable voice announcements' },
  { key: 'voice_rate', value: '0.9', description: 'Voice speed (0.1 - 2.0)' },
  { key: 'voice_pitch', value: '1.0', description: 'Voice pitch (0.0 - 2.0)' },
  { key: 'voice_volume', value: '1.0', description: 'Voice volume (0.0 - 1.0)' },
  { key: 'voice_lang', value: 'id-ID', description: 'Voice language' },
  { key: 'voice_repeat', value: '2', description: 'Number of times to repeat announcement' },
  { key: 'voice_delay', value: '2000', description: 'Delay between repeats (ms)' }
];

voiceSettings.forEach(setting => {
  const existing = db.prepare('SELECT * FROM settings WHERE key = ?').get(setting.key);
  
  if (existing) {
    console.log(`✅ ${setting.key} already exists: ${existing.value}`);
  } else {
    db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)').run(
      setting.key,
      setting.value,
      setting.description
    );
    console.log(`✅ Created ${setting.key}: ${setting.value}`);
  }
});

// Verify
console.log('\n📋 Step 2: Verification...\n');
const allVoiceSettings = db.prepare("SELECT * FROM settings WHERE key LIKE 'voice_%'").all();
console.log(`Total voice settings: ${allVoiceSettings.length}\n`);
allVoiceSettings.forEach(s => {
  console.log(`  ${s.key}: ${s.value} (${s.description})`);
});

console.log('\n' + '='.repeat(80));
console.log('✅ VOICE SETTINGS CREATED!\n');
console.log('Default settings:');
console.log('  - Enabled: true');
console.log('  - Speed: 0.9 (slightly slower for clarity)');
console.log('  - Pitch: 1.0 (normal)');
console.log('  - Volume: 1.0 (max)');
console.log('  - Language: id-ID (Indonesian)');
console.log('  - Repeat: 2 times');
console.log('  - Delay: 2 seconds between repeats');
