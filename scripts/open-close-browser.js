#!/usr/bin/env node
/* eslint-env node */
// Simple Puppeteer script to open a browser to a URL, wait, then close it.
// Usage:
//   node scripts/open-close-browser.js
// Environment variables:
//   URL - page to open (default: http://localhost:5173)
//   HEADLESS - if 'true' runs headless (default: 'false' => visible browser)
//   WAIT_MS - milliseconds to wait before closing (default: 5000)

import puppeteer from 'puppeteer';

const url = process.env.URL || 'http://localhost:5173';
const headless = (process.env.HEADLESS === 'true');
const waitMs = Number(process.env.WAIT_MS) || 5000;

async function openAndClose() {
    console.log(`Opening browser (headless=${headless}) to ${url} ...`);
    // Launch browser. puppeteer is in devDependencies in this project.
    const browser = await puppeteer.launch({ headless, args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => { });
        console.log(`Page opened. Waiting ${waitMs} ms before closing...`);
        await new Promise((res) => setTimeout(res, waitMs));
    } finally {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed.');
    }
}

openAndClose().catch((err) => {
    console.error('Error in open-close script:', err);
    process.exit(1);
});
