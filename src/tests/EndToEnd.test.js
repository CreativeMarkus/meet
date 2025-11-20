/**
 * @jest-environment node
 */
/* eslint-env jest,node */
import puppeteer from 'puppeteer';

// Environment-driven puppeteer options:
// - PUPPETEER_HEADLESS: set to 'false' to force visible browser; otherwise tests default to headless
// - PUPPETEER_SLOWMO: optional number (ms) to slow down operations
// Force headless mode to ensure browser closes properly and avoid conflicts
const headlessMode = 'new'; // Always use new headless mode
const slowMo = process.env.PUPPETEER_SLOWMO ? Number(process.env.PUPPETEER_SLOWMO) : 0;

// Share a single browser instance across all tests to avoid Windows temp directory locking issues
describe('End-to-End Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        // Launch browser in headless mode with unique profile to avoid conflicts
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        browser = await puppeteer.launch({
            headless: headlessMode,
            slowMo,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                `--user-data-dir=${require('os').tmpdir()}/puppeteer-${uniqueId}`
            ]
        });
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
        // Wait for the app to load
        await page.waitForSelector('#event-list .event', { timeout: 10000 });
    }, 30000);

    afterAll(async () => {
        // Aggressively close everything
        if (page && !page.isClosed()) {
            try {
                await page.close();
            } catch (e) {
                // Ignore errors during cleanup
            }
        }

        if (browser) {
            try {
                // Get all pages and close them
                const pages = await browser.pages();
                await Promise.all(pages.map(p => p.close().catch(() => { })));

                // Close browser
                await browser.close();
            } catch (e) {
                // Force kill if normal close fails
                try {
                    const process = browser.process();
                    if (process && process.pid) {
                        process.kill('SIGKILL');
                    }
                } catch (killError) {
                    // Ignore kill errors
                }
            }
        }
    }, 15000);

    describe('show/hide event details', () => {
        test('details are hidden by default', async () => {
            // Reload page to reset state
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForSelector('#event-list .event');

            const detailsHandle = await page.$('#event-list .event .details');
            expect(detailsHandle).toBeNull();
        }, 10000);

        test('clicking details button shows and hides details', async () => {
            // Reload page to reset state
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForSelector('#event-list .event');

            // Click to show details
            await page.waitForSelector('#event-list .event .details-btn');
            await page.click('#event-list .event .details-btn');

            await page.waitForSelector('#event-list .event .details');
            const detailsHandle = await page.$('#event-list .event .details');
            expect(detailsHandle).toBeDefined();

            // Click again to hide details
            await page.click('#event-list .event .details-btn');
            await page.waitForSelector('#event-list .event .details', { hidden: true });
            const detailsHandleAfter = await page.$('#event-list .event .details');
            expect(detailsHandleAfter).toBeNull();
        }, 15000);
    });

    describe('Filter Events by City', () => {
        test('user can search and filter events by city', async () => {
            // Reload page to reset state
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForSelector('#event-list .event');

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
});