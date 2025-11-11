import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testPKDashboard() {
  console.log('🧪 Testing PK Dashboard...\n');
  
  try {
    // Test with pk_madya
    console.log('1️⃣ Login as pk_madya...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'pk_madya',
      password: 'pk123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful');
    console.log(`   User: ${loginRes.data.user.name}`);
    console.log(`   Role: ${loginRes.data.user.role}\n`);
    
    // Get assignments
    console.log('2️⃣ Getting my assignments...');
    const assignRes = await axios.get(`${API_URL}/workflow/my-assignments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const assignments = assignRes.data.assignments || [];
    console.log(`✅ Found ${assignments.length} assignments\n`);
    
    if (assignments.length > 0) {
      console.log('📋 Assignments:');
      console.log('═══════════════════════════════════════════════════════════');
      assignments.forEach((a, i) => {
        console.log(`${i + 1}. ${a.queue_number} - ${a.client_name}`);
        console.log(`   PK: ${a.pk_name} (${a.pk_jabatan})`);
        console.log(`   Service: ${a.service_name}`);
        console.log(`   Status: ${a.status}`);
        console.log(`   Room: ${a.room_number || 'Not assigned'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No assignments found for PK Madya');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data.error}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

testPKDashboard();
