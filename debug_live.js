const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://startlaneai.web.app', { waitUntil: 'networkidle0' });

    // scroll exactly to the results section
    await page.evaluate(() => {
        const el = document.getElementById('results');
        if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    });

    await new Promise(r => setTimeout(r, 3000));

    await page.screenshot({ path: 'C:/Users/soura/.gemini/antigravity/scratch/startlane-ai/screenshot_results.png' });

    const data = await page.evaluate(() => {
        const section = document.getElementById('results');
        if (!section) return "NO RESULTS ID FOUND";

        const elements = Array.from(section.querySelectorAll('.font-headline'));
        return elements.map(el => el.textContent).join('\n');
    });

    fs.writeFileSync('C:/Users/soura/.gemini/antigravity/scratch/startlane-ai/debug_output.txt', data);
    console.log("Done. Check screenshot_results.png and debug_output.txt");

    await browser.close();
})();
