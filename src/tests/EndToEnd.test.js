/* eslint-env jest,node */
import puppeteer from 'puppeteer';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Environment-driven puppeteer options:
// - PUPPETEER_HEADLESS: 'true' to force headless mode; otherwise false by default for local debugging
// - PUPPETEER_SLOWMO: optional number (ms) to slow down operations; defaults to 0 in headless or 250 when visible
const headlessMode = process.env.PUPPETEER_HEADLESS === 'true' || !!process.env.CI;
const slowMo = process.env.PUPPETEER_SLOWMO ? Number(process.env.PUPPETEER_SLOWMO) : (headlessMode ? 0 : 250);

describe('show/hide event details', () => {
    let browser;
    let page;
    let profileDir;

    beforeAll(async () => {

        // create a unique temp profile dir to avoid "browser already running" conflicts
        profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer_profile_'));
        try {
            browser = await puppeteer.launch({
                headless: headlessMode,
                slowMo,
                timeout: 0,
                userDataDir: profileDir,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        } catch (err) {
            // If the custom profile dir is locked/used by another process, fall back to default launch
            // This avoids test failure when an external Chrome process is using the temp profile
            // (the original error message suggests using a different userDataDir).
            /* eslint-disable no-console */
            console.warn('puppeteer.launch with userDataDir failed, falling back to default launch:', err.message);
            /* eslint-enable no-console */
            browser = await puppeteer.launch({
                headless: headlessMode,
                slowMo,
                timeout: 0,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            // mark profileDir as undefined since we didn't use it
            profileDir = undefined;
        }
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
    }, 30000);

    afterAll(async () => {

        try {
            if (page && !page.isClosed && typeof page.isClosed === 'function') {
                const closed = await page.isClosed();
                if (!closed) await page.close();
            } else if (page && page.close) {
                await page.close();
            }
        } catch (e) {
            // ignore teardown errors
        }

        try {
            if (browser) await browser.close();
        } catch (e) {
            try {
                if (browser && browser.process && typeof browser.process === 'function') {
                    const proc = browser.process();
                    if (proc && proc.pid) {
                        try { process.kill(proc.pid); } catch (err) { /* ignore */ }
                    }
                }
            } catch (err) {
                // ignore
            }
        }

        // cleanup the temporary profile directory if it exists
        try {
            if (profileDir && fs.existsSync(profileDir)) {
                fs.rmSync(profileDir, { recursive: true, force: true });
            }
        } catch (err) {
            // ignore cleanup errors
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
    let profileDir;
    beforeAll(async () => {
        profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer_profile_'));
        try {
            browser = await puppeteer.launch({
                headless: headlessMode,
                slowMo,
                timeout: 0,
                userDataDir: profileDir,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        } catch (err) {
            console.warn('puppeteer.launch with userDataDir failed, falling back to default launch:', err.message);
            browser = await puppeteer.launch({
                headless: headlessMode,
                slowMo,
                timeout: 0,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            profileDir = undefined;
        }
        page = await browser.newPage();
        await page.goto('http://localhost:5173');
    }, 30000);

    afterAll(async () => {
        try {
            if (page && !page.isClosed && typeof page.isClosed === 'function') {
                const closed = await page.isClosed();
                if (!closed) await page.close();
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

        try {
            if (profileDir && fs.existsSync(profileDir)) {
                fs.rmSync(profileDir, { recursive: true, force: true });
            }
        } catch (err) {
            // ignore cleanup errors
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
