const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.type(), msg.text());
  });

  page.on('pageerror', exception => {
    console.log('UNCAUGHT EXCEPTION:', exception);
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' }).catch(e => console.log(e));
  
  // Wait a bit to ensure React finishes mounting and any errors are thrown
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
