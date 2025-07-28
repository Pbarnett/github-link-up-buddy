#!/usr/bin/env node

/**
 * Google OAuth Configuration Test
 * This script tests if the Google OAuth client ID is properly configured
 */

const https = require('https');
const url = require('url');

const CLIENT_ID = process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID || 'your_google_client_id';
const REDIRECT_URI = 'http://127.0.0.1:54321/auth/v1/callback';

console.log('🔍 Testing Google OAuth Configuration...');
console.log('📋 Client ID:', CLIENT_ID);
console.log('🔗 Redirect URI:', REDIRECT_URI);

// Test 1: Check if client ID format is valid
function validateClientId(clientId) {
  const pattern = /^\d+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/;
  return pattern.test(clientId);
}

console.log('\n✅ Client ID Format:', validateClientId(CLIENT_ID) ? 'Valid' : 'Invalid');

// Test 2: Try to make a request to Google OAuth endpoint
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(CLIENT_ID)}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `response_type=code&` +
  `scope=email profile&` +
  `state=test`;

console.log('\n🔗 Testing OAuth Authorization URL:');
console.log(authUrl);

// Test 3: Try to resolve the OAuth endpoint
const testRequest = https.request({
  hostname: 'accounts.google.com',
  path: `/o/oauth2/v2/auth?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=email&state=test`,
  method: 'GET',
  headers: {
    'User-Agent': 'OAuth-Test/1.0'
  }
}, (res) => {
  console.log('\n📡 OAuth Endpoint Response:');
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  if (res.statusCode === 200) {
    console.log('✅ OAuth client appears to be configured correctly');
  } else if (res.statusCode === 400) {
    console.log('❌ OAuth client configuration error - check client ID and redirect URI');
  } else {
    console.log('⚠️  Unexpected response - manual verification needed');
  }
});

testRequest.on('error', (err) => {
  console.error('❌ Request failed:', err.message);
});

testRequest.end();

// Test 4: Check Supabase local instance
console.log('\n🔍 Testing Supabase Local Instance...');
const localHttp = require('http');
const localRequest = localHttp.request({
  hostname: '127.0.0.1',
  port: 54321,
  path: '/auth/v1/authorize?provider=google',
  method: 'GET'
}, (res) => {
  console.log('Supabase Auth Status:', res.statusCode);
  if (res.statusCode === 302) {
    console.log('✅ Supabase OAuth redirect is working');
  } else {
    console.log('❌ Supabase OAuth configuration issue');
  }
});

localRequest.on('error', (err) => {
  console.log('❌ Supabase local instance not running:', err.message);
});

localRequest.end();
