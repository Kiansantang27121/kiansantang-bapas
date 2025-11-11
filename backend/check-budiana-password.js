import db from './database.js';
import bcrypt from 'bcryptjs';

console.log('🔍 CHECKING BUDIANA PASSWORD\n');
console.log('='.repeat(80));

try {
  const user = db.prepare(`
    SELECT * FROM users WHERE username = 'budiana'
  `).get();
  
  if (!user) {
    console.log('❌ User budiana not found!');
    process.exit(1);
  }
  
  console.log('\n✅ User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Password Hash: ${user.password.substring(0, 30)}...`);
  
  // Test passwords
  console.log('\n🔐 Testing passwords...\n');
  
  const passwords = ['budiana123', 'Budiana123', 'budiana', '123456'];
  
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, user.password);
    console.log(`   "${pwd}": ${match ? '✅ MATCH' : '❌ No match'}`);
  }
  
  // Reset password to budiana123
  console.log('\n🔄 Resetting password to "budiana123"...\n');
  
  const newPassword = await bcrypt.hash('budiana123', 10);
  
  db.prepare(`
    UPDATE users 
    SET password = ?
    WHERE username = 'budiana'
  `).run(newPassword);
  
  console.log('✅ Password reset successful!');
  
  // Verify
  const updatedUser = db.prepare(`
    SELECT * FROM users WHERE username = 'budiana'
  `).get();
  
  const verify = await bcrypt.compare('budiana123', updatedUser.password);
  console.log(`\n✅ Verification: ${verify ? 'Password is budiana123' : 'Failed'}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ DONE!\n');
  console.log('You can now login with:');
  console.log('   Username: budiana');
  console.log('   Password: budiana123');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
