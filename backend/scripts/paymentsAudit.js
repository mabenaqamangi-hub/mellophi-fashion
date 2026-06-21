const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function mask(value) {
  const str = String(value || '');
  if (!str) return 'MISSING';
  if (str.length <= 4) return '*'.repeat(str.length);
  return `${'*'.repeat(str.length - 4)}${str.slice(-4)}`;
}

async function fetchSafe(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    return { ok: true, status: response.status, headers: response.headers, body: text };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function printCheck(name, pass, detail) {
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}: ${detail}`);
}

(async function run() {
  console.log('=== Mellophi Payment Integration Audit ===');

  const checks = [];

  const merchantId = process.env.PAYGATE_ID || '';
  const merchantKey = process.env.PAYGATE_SECRET || '';
  const passphrase = process.env.PAYGATE_PASSPHRASE || '';
  const testMode = String(process.env.PAYGATE_TEST_MODE || '').toLowerCase();
  const processUrl = process.env.PAYGATE_PROCESS_URL || '';
  const returnUrl = process.env.PAYGATE_RETURN_URL || '';
  const cancelUrl = process.env.PAYGATE_CANCEL_URL || '';
  const notifyUrl = process.env.PAYGATE_NOTIFY_URL || '';
  const frontendUrl = process.env.FRONTEND_URL || '';

  checks.push({
    name: 'Credentials present',
    pass: !!merchantId && !!merchantKey,
    detail: `merchantId=${merchantId || 'MISSING'}, merchantKey=${mask(merchantKey)}, passphraseSet=${!!passphrase}`
  });

  checks.push({
    name: 'Live mode enabled',
    pass: testMode === 'false',
    detail: `PAYGATE_TEST_MODE=${testMode || 'unset'}`
  });

  checks.push({
    name: 'Live process URL',
    pass: processUrl === 'https://www.payfast.co.za/eng/process',
    detail: processUrl || 'MISSING'
  });

  checks.push({
    name: 'Callback URLs set',
    pass: !!returnUrl && !!notifyUrl,
    detail: `return=${returnUrl || 'MISSING'} | cancel=${cancelUrl || 'MISSING'} | notify=${notifyUrl || 'MISSING'}`
  });

  checks.push({
    name: 'Callback URLs use HTTPS',
    pass: returnUrl.startsWith('https://') && notifyUrl.startsWith('https://') && (!cancelUrl || cancelUrl.startsWith('https://')),
    detail: `returnHttps=${returnUrl.startsWith('https://')}, cancelHttps=${cancelUrl ? cancelUrl.startsWith('https://') : false}, notifyHttps=${notifyUrl.startsWith('https://')}`
  });

  checks.push({
    name: 'Frontend origin configured',
    pass: !!frontendUrl,
    detail: frontendUrl || 'MISSING'
  });

  const health = await fetchSafe('https://mellophi-fashion-api.onrender.com/api/health', {}, 60000);
  if (health.ok) {
    let parsed = null;
    try { parsed = JSON.parse(health.body); } catch (error) { parsed = null; }
    const dbConnected = parsed && parsed.database === 'connected';
    checks.push({
      name: 'Production API health',
      pass: health.status === 200,
      detail: `status=${health.status}`
    });
    checks.push({
      name: 'Production database connected',
      pass: !!dbConnected,
      detail: parsed ? `database=${parsed.database}` : 'invalid health JSON'
    });
  } else {
    checks.push({
      name: 'Production API health',
      pass: false,
      detail: health.error
    });
  }

  const corsProbe = await fetchSafe(
    'https://mellophi-fashion-api.onrender.com/api/health',
    { headers: { Origin: 'https://mabenaqamangi-hub.github.io' } },
    60000
  );

  if (corsProbe.ok) {
    const acao = corsProbe.headers.get('access-control-allow-origin') || '';
    checks.push({
      name: 'CORS allows frontend origin',
      pass: acao === 'https://mabenaqamangi-hub.github.io' || acao === '*',
      detail: `access-control-allow-origin=${acao || 'missing'}`
    });
  } else {
    checks.push({
      name: 'CORS allows frontend origin',
      pass: false,
      detail: corsProbe.error
    });
  }

  const notifyProbe = await fetchSafe(
    'https://mellophi-fashion-api.onrender.com/api/paygate/notify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'ping=1'
    },
    60000
  );

  if (notifyProbe.ok) {
    checks.push({
      name: 'Webhook endpoint reachable',
      pass: notifyProbe.status === 200 || notifyProbe.status === 400,
      detail: `status=${notifyProbe.status}, body=${notifyProbe.body}`
    });
  } else {
    checks.push({
      name: 'Webhook endpoint reachable',
      pass: false,
      detail: notifyProbe.error
    });
  }

  checks.forEach((c) => printCheck(c.name, c.pass, c.detail));

  const failed = checks.filter((c) => !c.pass);
  console.log('\n=== Summary ===');
  if (failed.length === 0) {
    console.log('All checks passed. Payment integration is production-ready.');
    process.exitCode = 0;
  } else {
    console.log(`${failed.length} check(s) failed:`);
    failed.forEach((f) => console.log(`- ${f.name}: ${f.detail}`));
    process.exitCode = 1;
  }
})();
