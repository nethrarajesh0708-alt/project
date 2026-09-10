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
    // Test 1: Login as admin and check Payroll section
    console.log('=== Test 1: Admin Payroll Section ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    console.log('Admin URL:', page.url());
    
    // Navigate to payroll
    await page.goto('http://localhost:5174/AdminDashboard', { waitUntil: 'networkidle0' });
    await sleep(1000);
    
    // Click on Payroll in sidebar
    const payrollLink = await page.$('a[href="#payroll"], .nav-link:contains("Payroll")');
    // Try clicking by text
    const links = await page.$$('.nav-link');
    for (const link of links) {
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
    
    const hasGeneratePayroll = await page.$('nav .nav-link') !== null;
    const subNavTexts = await page.$$eval('.payroll-sub-nav .nav-link', els => els.map(el => el.textContent));
    console.log('Sub-nav items:', subNavTexts);
    
    // Test 2: Employee profile salary slip button
    console.log('\n=== Test 2: Employee Salary Slip Access ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5174/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    // Check for Salary Slip button
    const hasSalarySlipBtn = await page.$('button:contains("Salary Slip"), a:contains("Salary Slip")') !== null;
    console.log('Has Salary Slip button:', hasSalarySlipBtn);
    
    // Get all buttons
    const buttons = await page.$$('button');
    const buttonTexts = [];
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text.trim()) buttonTexts.push(text.trim());
    }
    console.log('Buttons on profile:', buttonTexts);
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
