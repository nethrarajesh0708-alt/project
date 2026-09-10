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
    // Login as employee
    console.log('=== Test 1: Employee Dashboard Daily Task Entry ===');
    await page.goto('http://localhost:5174/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5174/EmployeeDashboard', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    // Check for Daily Task Entry action area
    const pageText = await page.$eval('body', el => el.textContent);
    const hasSaveEntry = pageText.includes('Save Entry');
    const hasStartTracking = pageText.includes('Start Tracking');
    const hasStopTracking = pageText.includes('Stop Tracking');
    const hasTimer = pageText.includes('00:00:00') || /\\d{2}:\\d{2}:\\d{2}/.test(pageText);
    
    console.log('Has Save Entry:', hasSaveEntry);
    console.log('Has Start Tracking:', hasStartTracking);
    console.log('Has Stop Tracking:', hasStopTracking);
    console.log('Has Timer:', hasTimer);
    
    // Test 2: Try starting without Project Code/Name
    console.log('\n=== Test 2: Start without Project Code/Name ===');
    const startBtn = await page.$('button:contains("Start Tracking")');
    if (startBtn) {
      await startBtn.click();
      await sleep(1000);
      
      const errorText = await page.$eval('body', el => el.textContent);
      const hasValidationError = errorText.includes('Please enter Project Code and Project Name');
      console.log('Validation error shown:', hasValidationError);
    }
    
    // Test 3: Fill form and start tracking
    console.log('\n=== Test 3: Start Tracking with valid data ===');
    await page.type('input[value="EMP0001"]', '', { clear: true });
    // Project Code and Name are already filled or we can fill them
    const projectCodeInput = await page.$('input[placeholder*="PRJ"]');
    const projectNameInput = await page.$('input[placeholder*="Website"]');
    
    if (projectCodeInput) {
      await projectCodeInput.type('PRJ-001');
    }
    if (projectNameInput) {
      await projectNameInput.type('Test Project');
    }
    
    await sleep(500);
    
    const startBtn2 = await page.$('button:contains("Start Tracking")');
    if (startBtn2) {
      await startBtn2.click();
      await sleep(2000);
      
      const afterStartText = await page.$eval('body', el => el.textContent);
      const hasStopTracking = afterStartText.includes('Stop Tracking');
      const hasTimerRunning = /\\d{2}:\\d{2}:\\d{2}/.test(afterStartText);
      console.log('Has Stop Tracking after start:', hasStopTracking);
      console.log('Timer running:', hasTimerRunning);
    }
    
    console.log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
