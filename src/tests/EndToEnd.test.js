/* eslint-env jest,node */
import puppeteer from 'puppeteer';

// Environment-driven puppeteer options:
// - PUPPETEER_HEADLESS: set to 'false' to force visible browser; otherwise tests default to headless to
//   avoid conflicts with existing local browser processes (safer for CI and local runs).
// - PUPPETEER_SLOWMO: optional number (ms) to slow down operations; defaults to 0 in headless or 250 when visible
// Default to headless unless explicitly set to 'false'. This reduces "browser already running" conflicts.
const headlessMode = process.env.PUPPETEER_HEADLESS === 'false' ? false : 'new'; // Use 'new' headless mode
const slowMo = process.env.PUPPETEER_SLOWMO ? Number(process.env.PUPPETEER_SLOWMO) : (headlessMode === false ? 250 : 0);

describe('show/hide event details', () => {
    let browser;
    let page;

    beforeAll(async () => {
        // Use 'new' headless mode and disable-dev-shm-usage for better Windows compatibility
        browser = await puppeteer.launch({
            headless: headlessMode,
            slowMo,
            timeout: 0,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ],
        });
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
    }, 30000);

    afterAll(async () => {

        try {
            if (page && typeof page.isClosed === 'function') {
                // page.isClosed() is synchronous and returns a boolean
                if (!page.isClosed()) await page.close();
            } else if (page && page.close) {
                await page.close();
            }
        } catch (e) {
            // ignore teardown errors
        }

        try {
            if (browser) await browser.close();
        } catch (e) {
            // if close fails, attempt to kill the underlying process as a last resort
            try {
                if (browser && typeof browser.process === 'function') {
                    const proc = browser.process();
                    if (proc && proc.pid) {
                        try { process.kill(proc.pid); } catch (err) { /* ignore */ }
                    }
                }
            } catch (err) {
                // ignore
            }
        }
    });

    test('show/hide event details: details are hidden by default', async () => {
        await page.waitForSelector('#event-list .event');

        const detailsHandle = await page.$('#event-list .event .details');
        expect(detailsHandle).toBeNull();
    }, 10000);

    test('show/hide event details: clicking details button shows details', async () => {
        await page.waitForSelector('#event-list .event');

        await page.waitForSelector('#event-list .event .details-btn');
        await page.click('#event-list .event .details-btn');

        await page.waitForSelector('#event-list .event .details');
        const detailsHandle = await page.$('#event-list .event .details');
        expect(detailsHandle).toBeDefined();

        await page.click('#event-list .event .details-btn');
        await page.waitForSelector('#event-list .event .details', { hidden: true });
        const detailsHandleAfter = await page.$('#event-list .event .details');
        expect(detailsHandleAfter).toBeNull();
    }, 10000);
});

describe('Filter Events by City', () => {
    let browser;
    let page;

    beforeAll(async () => {
        // Launch with improved Windows compatibility settings
        browser = await puppeteer.launch({
            headless: headlessMode,
            slowMo,
            timeout: 0,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ],
        });
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
    }, 30000);

    afterAll(async () => {
        try {
            if (page && typeof page.isClosed === 'function') {
                if (!page.isClosed()) await page.close();
            } else if (page && page.close) {
                await page.close();
            }
        } catch (e) {
            // ignore teardown errors
        }

        try {
            if (browser) await browser.close();
        } catch (e) {
            // ignore
        }
    });

    test('When user searches for a city, events are filtered by that city', async () => {
        // 1) Type a city name in the search input
        await page.waitForSelector('#city-search input');
        await page.click('#city-search input');
        await page.type('#city-search input', 'Berlin');

        // 2) Click a city from the suggestion list
        await page.waitForSelector('#city-search .suggestions li');
        // click the first suggestion (expected to be 'Berlin, Germany')
        await page.click('#city-search .suggestions li');

        // 3) Verify that the displayed events belong to that city
        await page.waitForSelector('#event-list .event');
        const locations = await page.$$eval('#event-list .event .location', els => els.map(e => e.textContent.trim()));
        expect(locations.length).toBeGreaterThan(0);
        // All displayed events should have location 'Berlin, Germany'
        expect(locations.every(loc => loc === 'Berlin, Germany')).toBe(true);
    }, 20000);
});
