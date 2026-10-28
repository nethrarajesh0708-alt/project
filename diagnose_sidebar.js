import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', path: '/manager/dashboard' },
  { id: 'leaves', label: 'Leave Requests', path: '/manager/leaves' },
  { id: 'attendance', label: 'Attendance', path: '/manager/attendance' },
  { id: 'employees', label: 'Team Members', path: '/manager/employees' },
  { id: 'chat', label: 'Team Chat', path: '/manager/chat' },
  { id: 'profile', label: 'My Profile', path: '/manager/profile' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const results = [];

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      results.forEach(r => {
        if (r.page === page.url().split('/manager/')[1]) {
          r.consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
        }
      });
    }
  });
  page.on('pageerror', err => {
    results.forEach(r => {
      if (r.page === page.url().split('/manager/')[1]) {
        r.consoleErrors.push(`[PAGE ERROR] ${err.message}`);
      }
    });
  });
  page.on('response', res => {
    const p = res.url().split('/manager/')[1]?.split('?')[0] || '';
    results.forEach(r => {
      if (r.page === p || r.page === res.url()) {
        r.network.push(`${res.status()} ${res.method} ${res.url()}`);
        if (res.status() >= 400) r.networkErrors.push(`${res.status()} ${res.url()}`);
      }
    });
  });

  // Login as manager
  await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
  await sleep(1000);
  await page.$eval('input[name="username"]', el => el.value = '');
  await page.$eval('input[name="password"]', el => el.value = '');
  await page.type('input[name="username"]', 'manager001');
  await page.type('input[name="password"]', 'Mgr@001');
  await page.click('button[type="submit"]');
  await sleep(3000);

  for (const p of PAGES) {
    const result = {
      page: p.path,
      label: p.label,
      consoleErrors: [],
      network: [],
      networkErrors: [],
      finalUrl: '',
      visibleText: '',
      bodyHtml: '',
    };
    results.push(result);

    await page.goto(`http://localhost:5173${p.path}`, { waitUntil: 'networkidle0' });
    await sleep(3000);

    result.finalUrl = page.url();
    result.visibleText = await page.evaluate(() => document.body.innerText);
    result.bodyHtml = await page.evaluate(() => document.body.innerHTML);
  }

  console.log('========================================');
  console.log('MANAGER SIDEBAR PAGES DIAGNOSTIC RESULTS');
  console.log('========================================\n');

  for (const r of results) {
    console.log(`=== ${r.label} (${r.page}) ===`);
    console.log(`Final URL: ${r.finalUrl}`);
    console.log(`Visible text (first 200 chars): ${r.visibleText.slice(0, 200)}`);
    console.log(`Console errors: ${r.consoleErrors.length}`);
    r.consoleErrors.forEach(e => console.log(`  ${e}`));
    if (r.consoleErrors.length === 0) console.log('  (none)');
    console.log(`Network errors (4xx/5xx): ${r.networkErrors.length}`);
    r.networkErrors.forEach(e => console.log(`  ${e}`));
    if (r.networkErrors.length === 0) console.log('  (none)');
    console.log(`All network requests: ${r.network.length}`);
    r.network.forEach(n => console.log(`  ${n}`));
    console.log('');
  }

  await browser.close();
})();
