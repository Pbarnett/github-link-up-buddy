#!/usr/bin/env node

// Test script to verify feature flag bucketing logic
import murmurhash from 'murmurhash-js';

function userInBucket(userId, rollout) {
  if (!userId) return false;
  if (rollout <= 0) return false;
  if (rollout >= 100) return true;
  
  const bucket = murmurhash.murmur3(userId) % 100;
  return bucket < rollout;
}

function getUserBucket(userId) {
  if (!userId) return 0;
  return murmurhash.murmur3(userId) % 100;
}

// Test with various user IDs
const testUsers = [
  'user-1',
  'user-2', 
  'user-3',
  'user-4',
  'user-5',
  'user-6',
  'user-7',
  'user-8',
  'user-9',
  'user-10',
  'user-11',
  'user-12',
  'user-13',
  'user-14',
  'user-15',
  'user-16',
  'user-17',
  'user-18',
  'user-19',
  'user-20'
];

console.log('🎯 Testing Feature Flag Bucketing Logic');
console.log('========================================');

// Test 5% rollout
console.log('\n📊 5% Rollout Test (should show ~5% of users):');
let enabled5 = 0;
testUsers.forEach(userId => {
  const bucket = getUserBucket(userId);
  const enabled = userInBucket(userId, 5);
  console.log(`User: ${userId.padEnd(8)} | Bucket: ${bucket.toString().padStart(2)} | Enabled: ${enabled}`);
  if (enabled) enabled5++;
});
console.log(`\n✅ 5% Rollout: ${enabled5}/${testUsers.length} users (${(enabled5/testUsers.length*100).toFixed(1)}%)`);

// Test 25% rollout
console.log('\n📊 25% Rollout Test (should show ~25% of users):');
let enabled25 = 0;
testUsers.forEach(userId => {
  const enabled = userInBucket(userId, 25);
  if (enabled) enabled25++;
});
console.log(`✅ 25% Rollout: ${enabled25}/${testUsers.length} users (${(enabled25/testUsers.length*100).toFixed(1)}%)`);

// Test 100% rollout
console.log('\n📊 100% Rollout Test (should show all users):');
let enabled100 = 0;
testUsers.forEach(userId => {
  const enabled = userInBucket(userId, 100);
  if (enabled) enabled100++;
});
console.log(`✅ 100% Rollout: ${enabled100}/${testUsers.length} users (${(enabled100/testUsers.length*100).toFixed(1)}%)`);

// Test deterministic behavior
console.log('\n🔄 Deterministic Test (same user should always get same result):');
const testUserId = 'test-user-123';
const results = [];
for (let i = 0; i < 5; i++) {
  results.push(userInBucket(testUserId, 5));
}
console.log(`User ${testUserId} (5% rollout): ${results.join(', ')}`);
console.log(`✅ Deterministic: ${results.every(r => r === results[0]) ? 'PASS' : 'FAIL'}`);

console.log('\n🎉 Feature Flag Tests Complete!');
