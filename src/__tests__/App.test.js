/* eslint-env jest */
import React from 'react';
import { render, within, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from './../App';
import mockData from '../mock-data';

jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
    };
});

describe('<App /> component', () => {
    test('renders without crashing', async () => {
        const { container } = render(<App />);
        await screen.findAllByRole('listitem');
        expect(container.querySelector('#event-list')).toBeInTheDocument();
    });

    test('renders list of events', async () => {
        const { container } = render(<App />);
        await screen.findAllByRole('listitem');
        expect(container.querySelector('#event-list')).toBeInTheDocument();
    });

    test('renders NumberOfEvents component', async () => {
        const { container } = render(<App />);
        await screen.findAllByRole('listitem');
        expect(container.querySelector('#number-of-events')).toBeInTheDocument();
    });
});

describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');
        const searchButton = within(CitySearchDOM).getByRole('button', { name: /search for events in this city/i });

        await user.type(CitySearchInput, 'Berlin, Germany');
        await user.click(searchButton);

        // Wait for the filtering to complete
        await waitFor(async () => {
            const renderedEventItems = await screen.findAllByRole('listitem');
            const allEvents = await getEvents();
            const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');
            expect(renderedEventItems.length).toBe(berlinEvents.length);
        });

        const allRenderedEventItems = await screen.findAllByRole('listitem');

        const allEvents = await getEvents();
        const berlinEvents = allEvents.filter(
            event => event.location === 'Berlin, Germany'
        );

        expect(allRenderedEventItems.length).toBe(berlinEvents.length);

        allRenderedEventItems.forEach(event => {
            expect(event.textContent).toContain("Berlin, Germany");
        });
    });

    test('renders number of events matching the number inputted by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
        const NumberOfEventsInput = within(NumberOfEventsDOM).queryByRole('textbox');

        await user.type(NumberOfEventsInput, '{backspace}{backspace}10');

        const allRenderedEventItems = await screen.findAllByRole('listitem');

        expect(allRenderedEventItems.length).toBe(10);
    });
});

afterEach(() => {
    try {
        cleanup();
        jest.clearAllTimers();
    } finally {
        jest.useRealTimers();
    }
});