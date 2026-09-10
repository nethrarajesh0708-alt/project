import puppeteer from 'puppeteer';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const line = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(line);
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
    console.log('PAGE ERROR:', err.message);
  });

  try {
    // Login as employee
    await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    console.log('After login URL:', page.url());
    
    // Navigate to profile
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    console.log('Profile URL:', page.url());
    
    // Check what's in the avatar area
    const avatarHtml = await page.$eval('.rounded-circle', el => el.innerHTML);
    console.log('Avatar HTML:', avatarHtml.substring(0, 200));
    
    // Check for SVG
    const svgCount = await page.$$('svg').then(svgs => svgs.length);
    console.log('SVG count:', svgCount);
    
    // Check for DefaultAvatar component
    const hasDefaultAvatar = await page.$('[style*="borderRadius: 50%"]') !== null;
    console.log('Has avatar div:', hasDefaultAvatar);
    
    // Get page title
    console.log('Page title:', await page.title());
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Console messages:', consoleMessages.length);
  console.log('Page errors:', errors.length);
  if (errors.length) errors.forEach(e => console.log('  ERROR:', e));
  
  await browser.close();
})();
