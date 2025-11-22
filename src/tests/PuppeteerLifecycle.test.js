/**
 * @jest-environment node
 */
/* eslint-env jest, node */
import puppeteer from 'puppeteer';

describe('Puppeteer Browser Lifecycle Test', () => {
    test('should open and close browser automatically', async () => {
        console.log('Starting Puppeteer browser test...');

        let browser;
        try {
            console.log('📱 Launching browser...');
            browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });

            console.log(' Browser launched successfully');
            expect(browser).toBeDefined();
            expect(browser.isConnected()).toBe(true);

            console.log('Creating new page...');
            const page = await browser.newPage();
            expect(page).toBeDefined();

            console.log('Navigating to example.com...');
            await page.goto('https://example.com', { waitUntil: 'networkidle2' });

            const title = await page.title();
            console.log(`Page title: "${title}"`);
            expect(title).toBeTruthy();

            console.log('Waiting 3 seconds so you can see the browser...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            console.log('Closing page...');
            await page.close();

            expect(browser.isConnected()).toBe(true);

        } catch (error) {
            console.error(' Error during browser test:', error.message);
            throw error;
        } finally {
            if (browser) {
                console.log('Closing browser...');
                await browser.close();
                console.log(' Browser closed successfully');

                expect(browser.isConnected()).toBe(false);
            }
        }

        console.log(' Puppeteer browser lifecycle test completed successfully!');
    }, 30000);
});