import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

function log(type, message) {
  if (type === 'success') {
    console.log('✅ ' + message);
    results.passed.push(message);
  } else if (type === 'error') {
    console.log('❌ ' + message);
    results.failed.push(message);
  } else if (type === 'warning') {
    console.log('⚠️  ' + message);
    results.warnings.push(message);
  } else {
    console.log('ℹ️  ' + message);
  }
}

async function testAuth() {
  console.log('\n🔐 Testing Authentication...\n');
  
  const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'operator', password: 'operator123', role: 'operator' },
    { username: 'petugas', password: 'petugas123', role: 'petugas_layanan' },
    { username: 'pk_madya', password: 'pk123', role: 'pk' }
  ];
  
  for (const user of users) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: user.username,
        password: user.password
      });
      
      if (response.data.token) {
        log('success', `Login ${user.username} (${user.role})`);
      } else {
        log('error', `Login ${user.username} - No token returned`);
      }
    } catch (error) {
      log('error', `Login ${user.username} - ${error.response?.data?.message || error.message}`);
    }
  }
}

async function testPKEndpoints(token) {
  console.log('\n👥 Testing PK Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/pk`);
    if (response.data && response.data.pks && Array.isArray(response.data.pks)) {
      log('success', `GET /pk - ${response.data.pks.length} PK found`);
      
      // Check if PK have jabatan
      const pkWithJabatan = response.data.pks.filter(pk => pk.jabatan);
      if (pkWithJabatan.length === response.data.pks.length) {
        log('success', 'All PK have jabatan field');
      } else {
        log('warning', `${response.data.pks.length - pkWithJabatan.length} PK missing jabatan`);
      }
    } else {
      log('error', 'GET /pk - Invalid response format');
    }
  } catch (error) {
    log('error', `GET /pk - ${error.message}`);
  }
}

async function testClientEndpoints(token) {
  console.log('\n👤 Testing Client Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/clients`);
    if (response.data && Array.isArray(response.data)) {
      log('success', `GET /clients - ${response.data.length} clients found`);
    } else {
      log('error', 'GET /clients - Invalid response format');
    }
  } catch (error) {
    log('error', `GET /clients - ${error.message}`);
  }
}

async function testServiceEndpoints(token) {
  console.log('\n🛎️  Testing Service Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/services`);
    if (response.data && Array.isArray(response.data)) {
      log('success', `GET /services - ${response.data.length} services found`);
      
      // Check for Bimbingan Wajib Lapor
      const bwl = response.data.find(s => s.name === 'Bimbingan Wajib Lapor');
      if (bwl) {
        log('success', 'Bimbingan Wajib Lapor service exists');
        if (bwl.requires_pk) {
          log('success', 'Bimbingan Wajib Lapor requires_pk = true');
        } else {
          log('warning', 'Bimbingan Wajib Lapor requires_pk = false');
        }
      } else {
        log('warning', 'Bimbingan Wajib Lapor service not found');
      }
    } else {
      log('error', 'GET /services - Invalid response format');
    }
  } catch (error) {
    log('error', `GET /services - ${error.message}`);
  }
}

async function testRoomEndpoints(token) {
  console.log('\n🚪 Testing Room Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    if (response.data && Array.isArray(response.data)) {
      log('success', `GET /rooms - ${response.data.length} rooms found`);
    } else {
      log('error', 'GET /rooms - Invalid response format');
    }
  } catch (error) {
    log('error', `GET /rooms - ${error.message}`);
  }
}

async function testWorkflowEndpoints(token) {
  console.log('\n🔄 Testing Workflow Endpoints...\n');
  
  try {
    // Test pending queues
    const pendingRes = await axios.get(`${API_URL}/workflow/pending-queues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (pendingRes.data.success) {
      log('success', `GET /workflow/pending-queues - ${pendingRes.data.queues.length} queues`);
    }
  } catch (error) {
    log('error', `GET /workflow/pending-queues - ${error.response?.data?.message || error.message}`);
  }
  
  try {
    // Test my-assignments (PK)
    const pkToken = await getPKToken();
    const assignRes = await axios.get(`${API_URL}/workflow/my-assignments`, {
      headers: { Authorization: `Bearer ${pkToken}` }
    });
    if (assignRes.data.success) {
      log('success', `GET /workflow/my-assignments - ${assignRes.data.assignments.length} need action, ${assignRes.data.in_process?.length || 0} in process`);
    }
  } catch (error) {
    log('error', `GET /workflow/my-assignments - ${error.response?.data?.message || error.message}`);
  }
}

async function getPKToken() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username: 'pk_madya',
    password: 'pk123'
  });
  return response.data.token;
}

async function getOperatorToken() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username: 'operator',
    password: 'operator123'
  });
  return response.data.token;
}

async function testQueueEndpoints(token) {
  console.log('\n📋 Testing Queue Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/queue`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && Array.isArray(response.data)) {
      log('success', `GET /queue - ${response.data.length} queues found`);
      
      // Check queue structure
      if (response.data.length > 0) {
        const queue = response.data[0];
        const requiredFields = ['id', 'queue_number', 'service_id', 'status'];
        const hasAllFields = requiredFields.every(field => queue.hasOwnProperty(field));
        if (hasAllFields) {
          log('success', 'Queue has all required fields');
        } else {
          log('warning', 'Queue missing some required fields');
        }
        
        // Check for new fields
        if (queue.hasOwnProperty('pk_approved_at')) {
          log('success', 'Queue has pk_approved_at field');
        } else {
          log('warning', 'Queue missing pk_approved_at field');
        }
      }
    } else {
      log('error', 'GET /queue - Invalid response format');
    }
  } catch (error) {
    log('error', `GET /queue - ${error.message}`);
  }
}

async function testSettingsEndpoints() {
  console.log('\n⚙️  Testing Settings Endpoints...\n');
  
  try {
    const response = await axios.get(`${API_URL}/settings`);
    if (response.data) {
      log('success', 'GET /settings - Settings retrieved');
      
      // Check voice settings
      const voiceSettings = ['voice_enabled', 'voice_rate', 'voice_pitch', 'voice_volume'];
      const hasVoiceSettings = voiceSettings.some(key => response.data.hasOwnProperty(key));
      if (hasVoiceSettings) {
        log('success', 'Voice settings configured');
      } else {
        log('warning', 'Voice settings not found');
      }
    }
  } catch (error) {
    log('error', `GET /settings - ${error.message}`);
  }
}

async function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(msg => console.log('  - ' + msg));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(msg => console.log('  - ' + msg));
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  const totalTests = results.passed.length + results.failed.length + results.warnings.length;
  const successRate = ((results.passed.length / totalTests) * 100).toFixed(1);
  
  if (results.failed.length === 0) {
    console.log(`🎉 ALL TESTS PASSED! (${successRate}% success rate)`);
  } else {
    console.log(`⚠️  SOME TESTS FAILED (${successRate}% success rate)`);
  }
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 KIANSANTANG COMPREHENSIVE TEST');
  console.log('='.repeat(60));
  
  try {
    await testAuth();
    
    const token = await getOperatorToken();
    
    await testPKEndpoints(token);
    await testClientEndpoints(token);
    await testServiceEndpoints(token);
    await testRoomEndpoints(token);
    await testQueueEndpoints(token);
    await testWorkflowEndpoints(token);
    await testSettingsEndpoints();
    
    await printSummary();
    
  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error.message);
  }
}

runAllTests();
