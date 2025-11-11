import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function test() {
  try {
    // Login sebagai petugas
    console.log('🔐 Login as petugas...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'petugas',
      password: 'petugas123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Login successful');
    console.log('👤 User:', loginRes.data.user.name);
    console.log('🎫 Token:', token.substring(0, 20) + '...');
    console.log('');
    
    // Get pending queues
    console.log('📋 Fetching pending queues...');
    const queueRes = await axios.get(`${API_URL}/workflow/pending-queues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Pending queues:', queueRes.data.queues.length, 'items');
    console.log('');
    
    if (queueRes.data.queues.length > 0) {
      console.log('📝 Queue details:');
      queueRes.data.queues.forEach((q, i) => {
        console.log(`\n${i + 1}. Queue #${q.queue_number}`);
        console.log(`   Service: ${q.service_name}`);
        console.log(`   Client: ${q.client_name}`);
        console.log(`   Status: ${q.status}`);
        console.log(`   Created: ${q.created_at}`);
        if (q.pk_name) console.log(`   PK: ${q.pk_name}`);
      });
    } else {
      console.log('⚠️  No pending queues found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

test();
