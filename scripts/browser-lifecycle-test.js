#!/usr/bin/env node

/* eslint-env node */

/**
 * Simple browser lifecycle test to demonstrate automatic browser open/close
 * This script runs outside of Jest to avoid WebSocket compatibility issues
 */

import puppeteer from 'puppeteer';

async function testBrowserLifecycle() {
    let browser = null;

    try {
        console.log('🚀 Starting browser lifecycle test...');

        // Launch browser
        console.log('📱 Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Show browser window
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        console.log('✅ Browser launched successfully!');

        // Create a new page
        console.log('📄 Creating new page...');
        const page = await browser.newPage();
        console.log('✅ Page created successfully!');

        // Navigate to a simple page
        console.log('🌐 Navigating to example.com...');
        await page.goto('https://example.com', {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        console.log('✅ Navigation successful!');

        // Get page title
        const title = await page.title();
        console.log(`📋 Page title: "${title}"`);

        // Wait a moment to see the browser
        console.log('⏱️ Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Close the page
        console.log('🗂️ Closing page...');
        await page.close();
        console.log('✅ Page closed successfully!');

        console.log('🎉 Browser lifecycle test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Error during browser lifecycle test:', error.message);
        return false;
    } finally {
        if (browser) {
            console.log('🔒 Closing browser...');
            await browser.close();
            console.log('✅ Browser closed successfully!');
        }
    }
}

// Run the test
testBrowserLifecycle()
    .then(success => {
        if (success) {
            console.log('\n✅ BROWSER LIFECYCLE TEST PASSED - Browser opened and closed automatically!');
            process.exit(0);
        } else {
            console.log('\n❌ BROWSER LIFECYCLE TEST FAILED');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('\n❌ Unexpected error:', error);
        process.exit(1);
    });