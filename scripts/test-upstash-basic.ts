/**
 * Basic Upstash Redis test to understand API format
 */

const REDIS_URL = 'https://summary-shepherd-52906.upstash.io'
const REDIS_TOKEN = 'Ac6qAAIjcDE5MGYwMjYyMGY3NjM0ZDYwOTIyMzRhZTBhOGFlMzRlOHAxMA'

async function testBasicOperations() {
  console.log('Testing Upstash Redis basic operations...\n')
  
  try {
    // Test 1: Simple SET
    console.log('📝 Test 1: SET operation')
    const setResponse = await fetch(`${REDIS_URL}/set/test_key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: 'test_value'
      })
    })
    
    console.log('SET Response status:', setResponse.status)
    const setResult = await setResponse.json()
    console.log('SET Result:', setResult)
    
    // Test 2: GET
    console.log('\n📖 Test 2: GET operation')
    const getResponse = await fetch(`${REDIS_URL}/get/test_key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    })
    
    console.log('GET Response status:', getResponse.status)
    const getResult = await getResponse.json()
    console.log('GET Result:', getResult)
    
    // Test 3: SET with NX and EX
    console.log('\n🔒 Test 3: SET with NX (not exists) and EX (expiry)')
    const setNxResponse = await fetch(`${REDIS_URL}/set/lock_test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: 'lock_value_123',
        nx: true,  // Only set if key doesn't exist
        ex: 10     // Expire in 10 seconds
      })
    })
    
    console.log('SET NX EX Response status:', setNxResponse.status)
    const setNxResult = await setNxResponse.json()
    console.log('SET NX EX Result:', setNxResult)
    
    // Test 4: Try to set the same key again (should fail)
    console.log('\n🚫 Test 4: Try SET NX on existing key (should fail)')
    const setNx2Response = await fetch(`${REDIS_URL}/set/lock_test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: 'lock_value_456',
        nx: true,
        ex: 10
      })
    })
    
    console.log('Second SET NX Response status:', setNx2Response.status)
    const setNx2Result = await setNx2Response.json()
    console.log('Second SET NX Result:', setNx2Result)
    
    // Test 5: TTL
    console.log('\n⏱️ Test 5: TTL check')
    const ttlResponse = await fetch(`${REDIS_URL}/ttl/lock_test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`
      }
    })
    
    console.log('TTL Response status:', ttlResponse.status)
    const ttlResult = await ttlResponse.json()
    console.log('TTL Result:', ttlResult)
    
    // Test 6: DEL
    console.log('\n🗑️ Test 6: DELETE operation')
    const delResponse = await fetch(`${REDIS_URL}/del/lock_test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('DEL Response status:', delResponse.status)
    const delResult = await delResponse.json()
    console.log('DEL Result:', delResult)
    
    // Cleanup
    await fetch(`${REDIS_URL}/del/test_key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('\n✅ Basic Upstash Redis operations completed')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (import.meta.main) {
  await testBasicOperations()
}
