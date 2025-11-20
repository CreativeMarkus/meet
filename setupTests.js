/* eslint-env jest, node */
import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX
global.React = React;

// Increase Jest timeout for end-to-end tests
jest.setTimeout(30000);