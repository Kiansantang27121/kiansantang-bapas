import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testPKApprove() {
  console.log('🧪 Testing PK Approve Action...\n');
  
  try {
    // 1. Login as pk_madya
    console.log('1️⃣ Login as pk_madya...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'pk_madya',
      password: 'pk123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful\n');
    
    // 2. Get assignments
    console.log('2️⃣ Getting my assignments...');
    const assignRes = await axios.get(`${API_URL}/workflow/my-assignments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const assignments = assignRes.data.assignments || [];
    console.log(`✅ Found ${assignments.length} assignments\n`);
    
    if (assignments.length === 0) {
      console.log('⚠️  No assignments to test');
      return;
    }
    
    // 3. Try to approve first assignment
    const queue = assignments[0];
    console.log('3️⃣ Testing Approve Action...');
    console.log(`   Queue: ${queue.queue_number}`);
    console.log(`   Client: ${queue.client_name}`);
    console.log(`   PK: ${queue.pk_name} (${queue.pk_jabatan})\n`);
    
    try {
      const approveRes = await axios.post(`${API_URL}/workflow/pk-action`, {
        queue_id: queue.id,
        action: 'approve'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ APPROVE SUCCESS!');
      console.log(`   Message: ${approveRes.data.message}`);
      console.log(`   Action: ${approveRes.data.action}`);
    } catch (error) {
      console.log('❌ APPROVE FAILED');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.error) {
        console.log(`   Details: ${error.response.data.error}`);
      }
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

testPKApprove();
