#!/usr/bin/env node
/* eslint-env node */
// This script runs Jest with environment variables that force Puppeteer
// to open a visible Chrome window and add a small slowMo so you can observe it.
// Note: Ensure your dev server (vite) is running at http://localhost:5173 before
// running this script, e.g. in a separate terminal run `npm run dev`.

const env = { ...process.env, PUPPETEER_HEADLESS: 'false', PUPPETEER_SLOWMO: '250' };

// Run Jest programmatically via the @jest/core API to avoid spawning external
// binaries (works in environments where `npm`/`npx` may not be available to child
// processes). This also keeps the environment variable injection straightforward.
import { runCLI } from '@jest/core';

(async () => {
    // merge env into process.env for child libs that read it directly
    Object.assign(process.env, env);

    try {
        const { results } = await runCLI({ runInBand: true }, [process.cwd()]);
        process.exit(results.success ? 0 : 1);
    } catch (err) {
        console.error('Error running Jest programmatically:', err);
        process.exit(1);
    }
})();
