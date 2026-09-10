import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  try {
    // Test 1: Admin - Payroll sub-navigation
    console.log('=== Test 1: Admin Payroll Sub-Navigation ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5174/AdminDashboard', { waitUntil: 'networkidle0' });
    await sleep(1000);
    
    // Click Payroll in sidebar
    const sidebarLinks = await page.$$('.nav-link');
    for (const link of sidebarLinks) {
      const text = await link.evaluate(el => el.textContent);
      if (text.includes('Payroll')) {
        await link.click();
        break;
      }
    }
    await sleep(1000);
    
    // Check for sub-navigation
    const hasSubNav = await page.$('.payroll-sub-nav') !== null;
    console.log('Has payroll sub-nav:', hasSubNav);
    
    const subNavTexts = await page.$$eval('.payroll-sub-nav .nav-link', els => els.map(el => el.textContent));
    console.log('Sub-nav items:', subNavTexts);
    
    // Click Salary Slip
    for (const link of await page.$$('.payroll-sub-nav .nav-link')) {
      const text = await link.evaluate(el => el.textContent);
      if (text.includes('Salary Slip')) {
        await link.click();
        break;
      }
    }
    await sleep(1000);
    
    const hasSalarySlipContent = await page.$('h4, .salary-slip-container, #salary-slip-print-area') !== null;
    console.log('Has Salary Slip content:', hasSalarySlipContent);
    
    const pageText = await page.$eval('body', el => el.textContent);
    const hasDeskIn = pageText.includes('Desk.in');
    const hasSalarySlipTitle = pageText.includes('Salary Slip');
    console.log('Has Desk.in:', hasDeskIn);
    console.log('Has Salary Slip title:', hasSalarySlipTitle);
    
    // Test 2: Employee - Profile Salary Slip button
    console.log('\n=== Test 2: Employee Profile Salary Slip Button ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5174/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    const profileText = await page.$eval('body', el => el.textContent);
    const hasSalarySlipBtn = profileText.includes('View Salary Slip');
    console.log('Has View Salary Slip button:', hasSalarySlipBtn);
    
    // Test 3: Direct route
    console.log('\n=== Test 3: Direct Salary Slip Route ===');
    await page.goto('http://localhost:5174/salary-slip', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    const directRouteText = await page.$eval('body', el => el.textContent);
    const directHasContent = directRouteText.includes('Salary Slip') || directRouteText.includes('Desk.in');
    console.log('Direct route has content:', directHasContent);
    
    console.log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
