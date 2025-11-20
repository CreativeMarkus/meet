/**
 * @jest-environment node
 */
/* eslint-env jest, node */
import puppeteer from 'puppeteer';

describe('Visual Browser Demo', () => {
    test('should visibly open and close browser for demonstration', async () => {
        console.log('🚀 Starting VISUAL browser demonstration...');

        let browser;
        try {
            // Launch browser with visible window for demonstration
            console.log('📱 Launching VISIBLE browser...');
            browser = await puppeteer.launch({
                headless: false, // Show browser window
                defaultViewport: null,
                slowMo: 100, // Slow down actions so you can see them
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage'
                ]
            });

            console.log('✅ Browser launched successfully - YOU SHOULD SEE IT!');
            expect(browser).toBeDefined();

            // Create a new page
            console.log('📄 Creating new page...');
            const page = await browser.newPage();

            // Navigate to example.com
            console.log('🌐 Navigating to example.com...');
            await page.goto('https://example.com', { waitUntil: 'networkidle2' });

            // Get page title to verify navigation
            const title = await page.title();
            console.log(`📋 Page title: "${title}"`);
            expect(title).toBeTruthy();

            // Wait 5 seconds so you can see the browser
            console.log('⏱️ Waiting 5 seconds so you can see the browser window...');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Navigate to Google
            console.log('🌐 Navigating to Google...');
            await page.goto('https://google.com', { waitUntil: 'networkidle2' });

            // Wait another 3 seconds
            console.log('⏱️ Waiting 3 more seconds...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Close the page
            console.log('📄 Closing page...');
            await page.close();

        } catch (error) {
            console.error('❌ Error during browser test:', error.message);
            throw error;
        } finally {
            if (browser) {
                console.log('🔒 Closing browser...');
                await browser.close();
                console.log('✅ Browser closed successfully');
            }
        }

        console.log('🎉 Visual browser demonstration completed successfully!');
    }, 30000); // 30 second timeout
});