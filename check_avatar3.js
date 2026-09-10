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
  
  // Clear all browser state
  await page.setCacheEnabled(false);
  await page.setExtraHTTPHeaders({'Cache-Control': 'no-cache'});
  
  try {
    await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    // Check the SVG content
    const svgContent = await page.$eval('svg', el => el.outerHTML.substring(0, 300));
    console.log('SVG content:', svgContent);
    
    // Check for specific new features
    const hasDoubleRing = await page.$('circle[stroke="#3b82f6"]') !== null;
    console.log('Has double ring:', hasDoubleRing);
    
    const hasStatusDot = await page.$('[style*="background-color: rgb(239, 68, 68)"]') !== null || await page.$('[style*="background-color: rgb(16, 185, 129)"]') !== null;
    console.log('Has status dot:', hasStatusDot);
    
    const hasGradient = await page.$('radialGradient') !== null;
    console.log('Has gradient:', hasGradient);
    
    // Take screenshot
    await page.screenshot({ path: 'C:/Users/Nethra/Downloads/main git file/employee-management-system-main/avatar_screenshot.png', fullPage: false });
    console.log('Screenshot saved');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
