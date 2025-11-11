import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

console.log('🧪 TESTING PK ENDPOINT\n');
console.log('='.repeat(80));

async function test() {
  try {
    // Step 1: Login as Budiana
    console.log('\n📋 Step 1: Login as Budiana...\n');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'budiana',
      password: 'budiana123'
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      return;
    }
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login successful!');
    console.log(`   User: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   User ID: ${user.id}`);
    console.log(`   Token: ${token.substring(0, 50)}...`);

    // Step 2: Get my assignments
    console.log('\n📋 Step 2: Get My Assignments...\n');
    
    const assignmentsResponse = await axios.get(`${API_URL}/workflow/my-assignments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!assignmentsResponse.data.success) {
      console.log('❌ Failed to get assignments:', assignmentsResponse.data.message);
      return;
    }
    
    const assignments = assignmentsResponse.data.assignments || [];
    
    console.log(`✅ Found ${assignments.length} assignments\n`);
    
    if (assignments.length === 0) {
      console.log('⚠️  No assignments found!');
      console.log('\n💡 Possible causes:');
      console.log('   1. No queues assigned to this PK');
      console.log('   2. API endpoint issue');
      console.log('   3. Database query issue');
    } else {
      assignments.forEach((assignment, index) => {
        console.log(`${index + 1}. ${assignment.queue_number}: ${assignment.client_name}`);
        console.log(`   Service: ${assignment.service_name}`);
        console.log(`   Status: ${assignment.status}`);
        console.log(`   Room: ${assignment.room_number || 'Not assigned'}`);
        console.log(`   PK Called: ${assignment.pk_called_at || 'No'}`);
        console.log(`   PK Entered: ${assignment.pk_entered_at || 'No'}`);
        console.log('');
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ TEST COMPLETE!\n');
    
    if (assignments.length > 0) {
      console.log('📊 Summary:');
      console.log(`   ✅ Login: OK`);
      console.log(`   ✅ API: OK`);
      console.log(`   ✅ Assignments: ${assignments.length} found`);
      console.log('\n💡 If frontend still shows 0, try:');
      console.log('   1. Hard refresh browser (Ctrl+Shift+R)');
      console.log('   2. Clear localStorage');
      console.log('   3. Logout and login again');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

test();
