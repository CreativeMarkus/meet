/**
 * @jest-environment node
 */
/* eslint-env jest,node */
import puppeteer from 'puppeteer';

const headlessMode = 'new';
const slowMo = process.env.PUPPETEER_SLOWMO ? Number(process.env.PUPPETEER_SLOWMO) : 0;
const testUrl = 'http://localhost:5174';

// Helper function to check if server is running
async function isServerRunning(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}

describe('End-to-End Tests', () => {
    let browser;
    let page;
    let serverAvailable = false;

    beforeAll(async () => {
        // Check if server is running
        serverAvailable = await isServerRunning(testUrl);

        if (!serverAvailable) {
            console.log(`⚠️  Development server not running at ${testUrl}`);
            console.log('ℹ️  To run End-to-End tests, start the dev server with: npm run dev');
            return;
        }

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
        await page.goto(testUrl);
        await page.waitForSelector('#event-list .event', { timeout: 10000 });
    }, 30000);

    afterAll(async () => {
        if (page && !page.isClosed()) {
            try {
                await page.close();
            } catch (e) {
                // Ignore errors during cleanup
            }
        }

        if (browser) {
            try {
                const pages = await browser.pages();
                await Promise.all(pages.map(p => p.close().catch(() => { })));

                await browser.close();
            } catch (e) {
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

            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForSelector('#event-list .event');

            const detailsHandle = await page.$('#event-list .event .details');
            expect(detailsHandle).toBeNull();
        }, 10000);

        test('clicking details button shows and hides details', async () => {
            await page.reload({ waitUntil: 'networkidle0' });
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
        }, 15000);
    });

    describe('Filter Events by City', () => {
        test('user can search and filter events by city', async () => {
            await page.reload({ waitUntil: 'networkidle0' });
            await page.waitForSelector('#event-list .event');

            await page.waitForSelector('#city-search input');
            await page.click('#city-search input');
            await page.type('#city-search input', 'Berlin');

            await page.waitForSelector('#city-search .suggestions li');
            await page.click('#city-search .suggestions li');

            await page.waitForSelector('#event-list .event');
            const locations = await page.$$eval('#event-list .event .location', els => els.map(e => e.textContent.trim()));
            expect(locations.length).toBeGreaterThan(0);
            expect(locations.every(loc => loc === 'Berlin, Germany')).toBe(true);
        }, 20000);
    });
});