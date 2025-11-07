/* eslint-env jest */
// src/__tests__/App.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import App from './../App';

describe('<App /> component', () => {
    test('renders without crashing', () => {
        render(<App />);
    });

    test('renders list of events', () => {
        const AppDOM = render(<App />).container.firstChild;
        expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
    });

    test('renders NumberOfEvents component', () => {
        const AppDOM = render(<App />).container.firstChild;
        expect(AppDOM.querySelector('#number-of-events')).toBeInTheDocument();
    });
});