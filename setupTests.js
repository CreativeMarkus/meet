/* eslint-env jest */
import '@testing-library/jest-dom';

// Increase default Jest timeout for async end-to-end tests
jest.setTimeout(30000);

// Ensure each test gets cleaned up to avoid stray mounted components and React act() warnings
import { cleanup } from '@testing-library/react';
afterEach(() => {
    cleanup();
    jest.useRealTimers();
});
