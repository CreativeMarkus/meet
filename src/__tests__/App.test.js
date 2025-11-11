/* eslint-env jest */
// src/__tests__/App.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
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


describe('<App /> integration', () => {
    test('renders a list of events matching the city selected by the user', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;


        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');


        await user.type(CitySearchInput, "Berlin");
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
});