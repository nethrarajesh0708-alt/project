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
    await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    // Get full avatar HTML
    const avatarHtml = await page.$eval('.rounded-circle', el => el.innerHTML);
    console.log('FULL AVATAR HTML:');
    console.log(avatarHtml);
    
    // Check for status dot
    const hasStatusDot = await page.$('[style*="border-radius: 50%"]') !== null;
    console.log('Has status dot:', hasStatusDot);
    
    // Get all SVG elements
    const svgs = await page.$$('svg');
    console.log('Total SVGs:', svgs.length);
    
    // Check first SVG (should be the avatar)
    if (svgs.length > 0) {
      const firstSvg = await svgs[0].evaluate(el => el.outerHTML);
      console.log('First SVG (avatar):', firstSvg.substring(0, 500));
    }
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
