import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const PAGES = [
  { label: 'Dashboard', path: '/manager/dashboard' },
  { label: 'Leave Requests', path: '/manager/leaves' },
  { label: 'Attendance', path: '/manager/attendance' },
  { label: 'Team Members', path: '/manager/employees' },
  { label: 'Team Chat', path: '/manager/chat' },
  { label: 'My Profile', path: '/manager/profile' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();

  let errors = [];
  let requests = {};

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push({ page: page.url(), msg: msg.text() });
    }
  });
  page.on('response', res => {
    const url = res.url();
    if (!requests[page.url()]) requests[page.url()] = [];
    requests[page.url()].push(`${res.status()} ${res.method} ${url}`);
  });

  await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
  await sleep(1000);
  await page.$eval('input[name="username"]', el => el.value = '');
  await page.$eval('input[name="password"]', el => el.value = '');
  await page.type('input[name="username"]', 'EMPMGR001');
  await page.type('input[name="password"]', 'Mgr@001');
  await page.click('button[type="submit"]');
  await sleep(3000);

  const results = [];
  for (const p of PAGES) {
    errors = []; requests = {};
    await page.goto(`http://localhost:5173${p.path}`, { waitUntil: 'networkidle0' });
    await sleep(3000);
    const text = await page.evaluate(() => document.body.innerText || '');
    const er = errors.slice();
    results.push({ label: p.label, path: p.path, errors: er, text: text.slice(0, 200).replace(/\n/g, ' | ') });
  }

  console.log('\n=== DASHBOARD/PROFILE VERIFICATION ===');
  for (const r of results) {
    console.log(`--- ${r.label} (${r.path}) ---`);
    console.log(`Console errors: ${r.errors.length}`);
    r.errors.forEach(e => console.log(`  [${e.page}] ${e.msg}`));
    if (r.errors.length === 0) console.log('  (no errors)');
    console.log(`Rendered text: ${r.text}`);
    console.log('');
  }

  await browser.close();
})();
