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
  
  await page.setCacheEnabled(false);
  
  try {
    await page.goto('http://localhost:5173/LoginFetch', { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.type('input[name="username"]', 'EMP0001');
    await page.type('input[name="password"]', 'hello');
    await page.click('button[type="submit"]');
    await sleep(3000);
    
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
    await sleep(2000);
    
    // Get status dot color
    const statusDotColor = await page.$eval('[title="active"], [title="unknown"], [title="inactive"]', el => getComputedStyle(el).backgroundColor);
    console.log('Status dot color:', statusDotColor);
    
    // Get all avatar features
    const features = {
      doubleRing: await page.$('circle[stroke="#3b82f6"]') !== null,
      gradient: await page.$('radialGradient') !== null,
      shadow: await page.$('feDropShadow') !== null,
      hair: await page.$('path[fill*="#1e293b"]') !== null,
      eyes: await page.$('ellipse[fill="#1e293b"]') !== null,
      smile: await page.$('path[stroke="#1e293b"]') !== null,
      shirt: await page.$('path[fill*="#2563eb"]') !== null,
    };
    console.log('Avatar features:', features);
    
    // Get profile info
    const profileName = await page.$eval('h3.fw-bold', el => el.textContent);
    const profileId = await page.$eval('.badge', el => el.textContent);
    console.log('Profile name:', profileName);
    console.log('Profile ID:', profileId);
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
