/* eslint-env jest */
// src/__tests__/App.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from './../App';

describe('<App /> component', () => {
    test('renders without crashing', async () => {
        const { container } = render(<App />);
        // wait for initial async effects in App to complete
        await waitFor(() => expect(container.querySelector('#event-list')).toBeInTheDocument());
    });

    test('renders list of events', async () => {
        const { container } = render(<App />);
        await waitFor(() => expect(container.querySelector('#event-list')).toBeInTheDocument());
    });

    test('renders NumberOfEvents component', async () => {
        const { container } = render(<App />);
        await waitFor(() => expect(container.querySelector('#number-of-events')).toBeInTheDocument());
    });
});


describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;


        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');


        await user.type(CitySearchInput, 'Berlin');
        const berlinSuggestionItem = await within(CitySearchDOM).findByText('Berlin, Germany');
        await user.click(berlinSuggestionItem);

        const EventListDOM = AppDOM.querySelector('#event-list');
        const allRenderedEventItems = await within(EventListDOM).findAllByRole('listitem');

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

        // Delete "32" and type "10"
        await user.type(NumberOfEventsInput, '{backspace}{backspace}10');

        // Wait for the UI to update and then query for the rendered event items.
        const EventListDOM = AppDOM.querySelector('#event-list');
        const allRenderedEventItems = await within(EventListDOM).findAllByRole('listitem');

        expect(allRenderedEventItems.length).toBe(10);
    });
});

// Ensure any fake timers are cleared and real timers restored so Jest can exit cleanly.
afterEach(() => {
    try {
        jest.clearAllTimers();
    } finally {
        jest.useRealTimers();
    }
});