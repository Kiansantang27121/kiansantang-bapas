import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testCompleteWorkflow() {
  console.log('🧪 Testing Complete PK Workflow...\n');
  
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
    
    // 3. Find queue that has been called to room (pk_called_at exists but pk_entered_at is null)
    const calledQueue = assignments.find(a => a.pk_called_at && !a.pk_entered_at);
    
    if (calledQueue) {
      console.log('3️⃣ Testing PK Enter Room...');
      console.log(`   Queue: ${calledQueue.queue_number}`);
      console.log(`   Client: ${calledQueue.client_name}`);
      console.log(`   Room: ${calledQueue.room_number}\n`);
      
      try {
        const enterRes = await axios.post(`${API_URL}/workflow/pk-enter-room`, {
          queue_id: calledQueue.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ PK Enter Room SUCCESS');
        console.log(`   Message: ${enterRes.data.message}\n`);
      } catch (error) {
        console.log('❌ PK Enter Room FAILED');
        console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
      }
    }
    
    // 4. Find queue that PK has entered (pk_entered_at exists but client_called_at is null)
    const enteredQueue = assignments.find(a => a.pk_entered_at && !a.client_called_at);
    
    if (enteredQueue) {
      console.log('4️⃣ Testing PK Call Client...');
      console.log(`   Queue: ${enteredQueue.queue_number}`);
      console.log(`   Client: ${enteredQueue.client_name}`);
      console.log(`   Room: ${enteredQueue.room_number}\n`);
      
      try {
        const callRes = await axios.post(`${API_URL}/workflow/pk-call-client`, {
          queue_id: enteredQueue.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ PK Call Client SUCCESS');
        console.log(`   Message: ${callRes.data.message}`);
        console.log(`   Call Data:`, callRes.data.call_data);
      } catch (error) {
        console.log('❌ PK Call Client FAILED');
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
      }
    } else {
      console.log('⚠️  No queue ready to call client (need to enter room first)');
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

testCompleteWorkflow();
