import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

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

  try {
    // Test 1: Login as admin
    console.log('=== Test 1: Admin login ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    console.log('Admin URL:', page.url());
    
    // Check for console errors
    const adminErrors = errors.filter(e => e.includes('undefined') || e.includes('null') || e.includes('cannot'));
    console.log('Admin page errors:', adminErrors.length);
    
    // Test 2: Login as employee
    console.log('\n=== Test 2: Employee login ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    console.log('Employee URL:', page.url());
    
    // Navigate to profile
    await page.goto('http://localhost:5174/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    console.log('Profile URL:', page.url());
    
    // Check if DefaultAvatar SVG is rendered
    const hasSvg = await page.$('svg') !== null;
    console.log('Profile has SVG avatar:', hasSvg);
    
    // Check for errors on profile page
    const profileErrors = errors.filter(e => e.includes('undefined') || e.includes('null') || e.includes('cannot'));
    console.log('Profile page errors:', profileErrors.length);
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Total console messages:', consoleMessages.length);
  console.log('Total page errors:', errors.length);
  if (errors.length) {
    errors.forEach(e => console.log('  ERROR:', e));
  }
  
  await browser.close();
})();
