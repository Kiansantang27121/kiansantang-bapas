import axios from 'axios';
import bcrypt from 'bcryptjs';
import db from './database.js';

const API_URL = 'http://localhost:3000/api';

console.log('🧪 TESTING ALL ROLE LOGINS\n');
console.log('='.repeat(80));

// Test accounts
const testAccounts = [
  { role: 'admin', username: 'admin', password: 'admin123', name: 'Administrator' },
  { role: 'petugas_layanan', username: 'petugas', password: 'petugas123', name: 'Petugas Layanan' },
  { role: 'pk', username: 'budiana', password: 'pk123', name: 'Budiana' },
  { role: 'struktural', username: 'struktural', password: 'struktural123', name: 'Struktural' },
  { role: 'operator', username: 'petugas_penghadapan', password: 'operator123', name: 'Petugas Penghadapan' }
];

async function testLogin(username, password, expectedRole) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });

    if (response.data.token) {
      const actualRole = response.data.user.role;
      const match = actualRole === expectedRole;
      
      console.log(`${match ? '✅' : '⚠️'} ${username}`);
      console.log(`   Expected: ${expectedRole}`);
      console.log(`   Actual: ${actualRole}`);
      console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      console.log(`   Name: ${response.data.user.name}`);
      
      return { success: true, role: actualRole, token: response.data.token };
    }
  } catch (error) {
    console.log(`❌ ${username}`);
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAPIAccess(token, role, endpoint, method = 'GET') {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await axios(config);
    console.log(`  ✅ ${endpoint} - ${response.status}`);
    return true;
  } catch (error) {
    console.log(`  ❌ ${endpoint} - ${error.response?.status || 'ERROR'}: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function ensureTestAccounts() {
  console.log('\n📝 ENSURING TEST ACCOUNTS EXIST:\n');

  for (const account of testAccounts) {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(account.username);
    
    if (!user) {
      console.log(`⚠️  Creating ${account.role}: ${account.username}`);
      const hashedPassword = await bcrypt.hash(account.password, 10);
      
      try {
        const result = db.prepare(`
          INSERT INTO users (username, password, name, role)
          VALUES (?, ?, ?, ?)
        `).run(account.username, hashedPassword, account.name, account.role);
        
        console.log(`   ✅ Created with ID: ${result.lastInsertRowid}`);
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    } else if (user.role !== account.role) {
      console.log(`⚠️  Updating role for ${account.username}: ${user.role} → ${account.role}`);
      db.prepare('UPDATE users SET role = ? WHERE username = ?').run(account.role, account.username);
      console.log(`   ✅ Role updated`);
    } else {
      console.log(`✅ ${account.role}: ${account.username} exists`);
    }
  }
}

async function runTests() {
  await ensureTestAccounts();

  console.log('\n\n🔐 TESTING LOGINS:\n');
  console.log('='.repeat(80));

  const results = {};

  for (const account of testAccounts) {
    console.log(`\n${account.role.toUpperCase()}:`);
    const result = await testLogin(account.username, account.password, account.role);
    results[account.role] = result;
    
    if (result.success) {
      console.log('\n  Testing API Access:');
      
      // Test common endpoints
      await testAPIAccess(result.token, account.role, '/dashboard/stats');
      
      // Test role-specific endpoints
      if (account.role === 'petugas_layanan') {
        await testAPIAccess(result.token, account.role, '/workflow/pending-queues');
        await testAPIAccess(result.token, account.role, '/workflow/ready-to-call');
        await testAPIAccess(result.token, account.role, '/pk');
      } else if (account.role === 'pk') {
        await testAPIAccess(result.token, account.role, '/workflow/my-assignments');
      } else if (account.role === 'admin') {
        await testAPIAccess(result.token, account.role, '/users');
        await testAPIAccess(result.token, account.role, '/services');
      }
    }
  }

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY:\n');

  let successCount = 0;
  let failCount = 0;

  for (const [role, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${role}: LOGIN SUCCESS`);
      successCount++;
    } else {
      console.log(`❌ ${role}: LOGIN FAILED - ${result.error}`);
      failCount++;
    }
  }

  console.log(`\nTotal: ${successCount} success, ${failCount} failed`);

  if (failCount === 0) {
    console.log('\n🎉 ALL ROLES CAN LOGIN SUCCESSFULLY!');
  } else {
    console.log('\n⚠️  SOME ROLES HAVE LOGIN ISSUES');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ TEST COMPLETE\n');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
