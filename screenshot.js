const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('Visiting aevoy.com...');
    await page.goto('https://aevoy.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/workspaces/upscall/aevoy.png', fullPage: false });
    console.log('aevoy.com screenshot saved');

    console.log('Visiting landonorris.com...');
    await page.goto('https://landonorris.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/workspaces/upscall/landonorris.png', fullPage: false });
    console.log('landonorris.com screenshot saved');

    await browser.close();
})();
