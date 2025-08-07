#!/usr/bin/env node

// Quick test to check if /booking route renders correctly
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TEST_URL = 'http://localhost:3000/test-booking';

function testBookingRoute() {
  console.log('Testing /booking route...');
  
  const url = new URL(TEST_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const req = client.request({
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TestBot)',
    }
  }, (res) => {
    let html = '';
    
    res.on('data', (chunk) => {
      html += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        // Check if the page contains expected content
        const hasFormElements = html.includes('LAX, New York, etc.') && html.includes('JFK, London, etc.');
        const hasSecureBooking = html.includes('SecureFlightBooking') || html.includes('flight search');
        
        console.log(`✅ Route accessible: ${res.statusCode}`);
        console.log(`✅ Has form elements: ${hasFormElements}`);
        console.log(`✅ Has secure booking: ${hasSecureBooking}`);
        
        if (hasFormElements) {
          console.log('🎉 Success: The /booking route contains the expected flight search form elements!');
        } else {
          console.log('❌ The /booking route does not contain expected form elements.');
          console.log('First 500 chars of response:');
          console.log(html.substring(0, 500));
        }
      } else {
        console.log(`❌ Route not accessible: ${res.statusCode} ${res.statusMessage}`);
        console.log('Response body:', html.substring(0, 200));
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Error testing route:', error.message);
    console.log('Make sure the dev server is running on port 3000');
  });
  
  req.end();
}

testBookingRoute();
