import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function testForwardToPK() {
  console.log('🧪 Testing Forward to PK...\n');
  
  try {
    // 1. Login as operator
    console.log('1️⃣ Login as operator...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'operator',
      password: 'operator123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful\n');
    
    // 2. Get pending queues
    console.log('2️⃣ Getting pending queues...');
    const queuesRes = await axios.get(`${API_URL}/workflow/pending-queues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const queues = queuesRes.data.queues || [];
    console.log(`✅ Found ${queues.length} pending queues\n`);
    
    if (queues.length === 0) {
      console.log('⚠️  No queues to test. Please create a queue first.');
      return;
    }
    
    // 3. Get first queue
    const queue = queues[0];
    console.log('3️⃣ Testing with queue:');
    console.log(`   ID: ${queue.id}`);
    console.log(`   Number: ${queue.queue_number}`);
    console.log(`   Client: ${queue.client_name}`);
    console.log(`   PK ID: ${queue.pk_id || 'Not assigned'}`);
    console.log(`   PK Name: ${queue.pk_name || 'Not assigned'}`);
    console.log('');
    
    // 4. Get available rooms
    console.log('4️⃣ Getting available rooms...');
    const roomsRes = await axios.get(`${API_URL}/workflow/available-rooms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const rooms = roomsRes.data.rooms || [];
    console.log(`✅ Found ${rooms.length} available rooms\n`);
    
    if (rooms.length === 0) {
      console.log('⚠️  No rooms available. Please check rooms table.');
      return;
    }
    
    const room = rooms[0];
    console.log(`   Using room: ${room.room_name || room.room_number}\n`);
    
    // 5. Forward to PK
    console.log('5️⃣ Forwarding to PK...');
    const forwardRes = await axios.post(`${API_URL}/workflow/forward-to-pk`, {
      queue_id: queue.id,
      room_number: room.room_number
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ SUCCESS!');
    console.log('\nResponse:');
    console.log(JSON.stringify(forwardRes.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data.message || error.response.data.error}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

testForwardToPK();
