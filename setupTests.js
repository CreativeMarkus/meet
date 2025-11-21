/* eslint-env jest, node */
import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX
global.React = React;

// Increase Jest timeout for end-to-end tests
jest.setTimeout(30000);

// Mock fetch for Jest environment
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'mock_token' }),
    })
);

// Mock localStorage for tests
const localStorageMock = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the API module to prevent OAuth flow in tests
jest.mock('./src/api.js', () => {
    const mockData = require('./src/mock-data.js').default;
    return {
        isAuthenticated: jest.fn(() => Promise.resolve(false)), // Always return false to use mock data
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: jest.fn((events) => {
            if (!Array.isArray(events)) return [];
            const extractedLocations = events.map((event) => event.location);
            const locations = [...new Set(extractedLocations)];
            return locations;
        }),
    };
});