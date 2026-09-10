import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const testCases = [
  { name: 'admin + hello', username: 'admin', password: 'hello', expect: 'AdminDashboard' },
  { name: 'ADMIN + 123', username: 'ADMIN', password: '123', expect: 'AdminDashboard' },
  { name: 'Admin + anything', username: 'Admin', password: 'anything', expect: 'AdminDashboard' },
  { name: 'EMP0001 + hello', username: 'EMP0001', password: 'hello', expect: 'EmployeeDashboard' },
  { name: 'emp0001 + 123', username: 'emp0001', password: '123', expect: 'EmployeeDashboard' },
  { name: 'Emp0001 + anything', username: 'Emp0001', password: 'anything', expect: 'EmployeeDashboard' },
  { name: 'testuser + hello', username: 'testuser', password: 'hello', expect: 'LoginFetch' },
  { name: 'xyz + password', username: 'xyz', password: 'password', expect: 'LoginFetch' },
  { name: 'admin + empty', username: 'admin', password: '', expect: 'LoginFetch' },
  { name: 'EMP0001 + empty', username: 'EMP0001', password: '', expect: 'LoginFetch' },
];

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const line = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(line);
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  for (const tc of testCases) {
    await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(1000);
    
    await page.$eval('input[name="username"]', el => el.value = '');
    await page.$eval('input[name="password"]', el => el.value = '');
    
    await page.type('input[name="username"]', tc.username);
    await page.type('input[name="password"]', tc.password);
    
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    const url = page.url();
    const route = url.split('/').pop() || '';
    const passed = route === tc.expect || (tc.expect === 'LoginFetch' && route === 'LoginFetch');
    
    console.log(`${passed ? '✓' : '✗'} ${tc.name} → ${route} (expected: ${tc.expect})`);
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Console messages:', consoleMessages.length);
  console.log('Page errors:', errors.length);
  if (errors.length) errors.forEach(e => console.log('  ERROR:', e));
  
  await browser.close();
})();
