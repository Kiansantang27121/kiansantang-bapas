import db from './database.js';

console.log('📋 Checking table structures...\n');

// Check users table
console.log('👥 USERS TABLE:');
const usersInfo = db.prepare("PRAGMA table_info(users)").all();
console.log('Columns:', usersInfo.map(c => c.name).join(', '));
console.log('\nFull structure:');
usersInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Check queue table
console.log('\n\n📋 QUEUE TABLE:');
const queueInfo = db.prepare("PRAGMA table_info(queue)").all();
console.log('Columns:', queueInfo.map(c => c.name).join(', '));
console.log('\nFull structure:');
queueInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Check services table
console.log('\n\n🔧 SERVICES TABLE:');
const servicesInfo = db.prepare("PRAGMA table_info(services)").all();
console.log('Columns:', servicesInfo.map(c => c.name).join(', '));
console.log('\nFull structure:');
servicesInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Show sample users
console.log('\n\n👥 SAMPLE USERS:');
const users = db.prepare('SELECT * FROM users LIMIT 5').all();
users.forEach(user => {
  console.log(user);
});
