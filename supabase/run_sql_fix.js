#!/usr/bin/env node

// Simple script to run SQL via Supabase API
import fs from 'fs';
import https from 'https';

const projectRef = 'bbonngdyfyfjqfhvoljl';
const sqlFile = './quick_fix_profiles.sql';

// Read the SQL file
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

console.log('To run this SQL on your Supabase database:');
console.log('1. Go to https://supabase.com/dashboard/project/' + projectRef + '/sql');
console.log('2. Copy and paste the following SQL:');
console.log('');
console.log('-- SQL to fix profiles table for user creation');
console.log(sqlContent);
console.log('');
console.log('3. Click "Run" to execute the SQL');
console.log('4. Once completed, try creating the test user again');
