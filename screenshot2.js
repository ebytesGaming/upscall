const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    // aevoy — scroll mid-page
    await page.goto('https://aevoy.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/workspaces/upscall/aevoy_full.png', fullPage: true });

    // landonorris — scroll mid-page
    await page.goto('https://landonorris.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/workspaces/upscall/landonorris_scroll.png', fullPage: false });

    await browser.close();
})();
