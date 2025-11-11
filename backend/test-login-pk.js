import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testLogin() {
  console.log('🔐 Testing PK Login...\n');
  
  const pkUsers = [
    { username: 'pk_madya', password: 'pk123', name: 'PK Madya' },
    { username: 'pk_muda', password: 'pk123', name: 'PK Muda' },
    { username: 'pk_pertama', password: 'pk123', name: 'PK Pertama' },
    { username: 'apk', password: 'pk123', name: 'APK' }
  ];
  
  for (const user of pkUsers) {
    try {
      console.log(`Testing: ${user.name} (${user.username})`);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: user.username,
        password: user.password
      });
      
      if (response.data.token) {
        console.log(`✅ SUCCESS - ${user.name}`);
        console.log(`   User: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      }
    } catch (error) {
      console.log(`❌ FAILED - ${user.name}`);
      console.log(`   Error: ${error.response?.data?.error || error.message}`);
    }
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════════════');
}

testLogin();
