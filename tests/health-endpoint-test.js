import fetch from 'node-fetch';

async function testHealthEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    const healthData = await response.json();

    const expectedKeys = [
      'status',
      'timestamp',
      'version',
      'services',
      'environment',
      'uptime'
    ];

    expectedKeys.forEach(key => {
      if (!healthData.hasOwnProperty(key)) {
        throw new Error(`Missing expected key in health response: ${key}`);
      }
    });

    console.log('Health endpoint is working correctly.');
  } catch (error) {
    console.error('Health endpoint test failed:', error);
  }
}

// Run the test
testHealthEndpoint();

