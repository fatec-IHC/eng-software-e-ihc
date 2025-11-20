#!/usr/bin/env node
const crypto = require('crypto');
const https = require('https');

const REPO = 'dabliuweb/eng-software-e-ihc';
const PAT_TOKEN = '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';
const PUBLIC_KEY = 'feQxNEkBuNllCw4OHlUTv0XNUrrSXyvrfG5LX4mcTFo=';
const KEY_ID = '3380204578043523366';

// Simple encryption using Node.js crypto (sodium-compatible)
function encryptSecret(publicKeyBase64, secretValue) {
  // This is a simplified version - for production use libsodium
  // For now, we'll use a workaround or direct API call
  return Buffer.from(secretValue).toString('base64');
}

function makeRequest(method, path, data, callback) {
  const options = {
    hostname: 'api.github.com',
    path: path,
    method: method,
    headers: {
      'Authorization': `token ${PAT_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      callback(res.statusCode, body);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    callback(0, e.message);
  });

  if (data) {
    req.write(JSON.stringify(data));
  }
  req.end();
}

// For GitHub secrets, we need proper libsodium encryption
// Since we don't have it, let's provide instructions instead
console.log('🔐 To add secrets, please use one of these methods:');
console.log('');
console.log('Method 1: GitHub Web UI (Easiest)');
console.log('1. Go to: https://github.com/dabliuweb/eng-software-e-ihc/settings/secrets/actions');
console.log('2. Click "New repository secret"');
console.log('3. Add: GITHUB_TOKEN = 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');
console.log('');
console.log('Method 2: GitHub CLI');
console.log('gh secret set GITHUB_TOKEN --repo dabliuweb/eng-software-e-ihc --body "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"');
console.log('');
console.log('⚠️  You also need to add Supabase secrets:');
console.log('   - NEXT_PUBLIC_SUPABASE_URL');
console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');

