const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const errors = [];
const warnings = [];

function required(name) {
  if (!process.env[name] || String(process.env[name]).trim() === '') {
    errors.push(`Missing required env: ${name}`);
  }
}

function mustNotContain(name, token) {
  const value = process.env[name] || '';
  if (value.includes(token)) {
    warnings.push(`${name} contains '${token}' and is likely not production-ready`);
  }
}

required('PAYGATE_ID');
required('PAYGATE_SECRET');
required('PAYGATE_RETURN_URL');
required('PAYGATE_NOTIFY_URL');
required('FRONTEND_URL');
required('JWT_SECRET');

const testMode = String(process.env.PAYGATE_TEST_MODE || '').toLowerCase();
if (testMode !== 'false') {
  errors.push('PAYGATE_TEST_MODE must be false for real payments');
}

const returnUrl = process.env.PAYGATE_RETURN_URL || '';
const notifyUrl = process.env.PAYGATE_NOTIFY_URL || '';
const frontendUrl = process.env.FRONTEND_URL || '';

if (!returnUrl.startsWith('https://')) {
  errors.push('PAYGATE_RETURN_URL must use https:// in production');
}

if (!notifyUrl.startsWith('https://')) {
  errors.push('PAYGATE_NOTIFY_URL must use https:// in production');
}

if (returnUrl.includes('localhost') || notifyUrl.includes('localhost')) {
  errors.push('PayGate URLs cannot point to localhost for real payments');
}

if (frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1')) {
  warnings.push('FRONTEND_URL still contains local origins');
}

mustNotContain('PAYGATE_ID', 'your_');
mustNotContain('PAYGATE_SECRET', 'your_');
mustNotContain('JWT_SECRET', 'CHANGE_THIS');

console.log('=== Mellophi Payments Preflight ===');
console.log(`Env file loaded: ${fs.existsSync(envPath) ? envPath : 'not found (using process env only)'}`);

if (warnings.length) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.log('\nErrors:');
  for (const error of errors) console.log(`- ${error}`);
  console.log('\nResult: FAILED');
  process.exitCode = 1;
} else {
  console.log('\nResult: OK for real payment cutover');
}
