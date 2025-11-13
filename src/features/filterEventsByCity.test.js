/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

const feature = loadFeature('./src/features/filterEventsByCity.feature');

defineFeature(feature, test => {
    test("When user hasn't searched for a city, show upcoming events from all cities.", ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;

        given("user hasn't searched for any city", () => {
        });

        when('the user opens the app', () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
        });

        then('the user should see the list of all upcoming events.', async () => {
            await waitFor(() => {
                const EventListDOM = AppDOM.querySelector('#event-list');
                const items = within(EventListDOM).queryAllByRole('listitem');
                expect(items.length).toBe(32);
            });
        });
    });

    test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
        let CitySearchDOM;
        let cityTextBox;

        given('the main page is open', () => {
            const AppComponent = render(<App />);
            const AppDOM = AppComponent.container.firstChild;
            CitySearchDOM = AppDOM.querySelector('#city-search');
            cityTextBox = within(CitySearchDOM).queryByRole('textbox');
        });

        when('user starts typing in the city textbox', async () => {
            const user = userEvent.setup();
            await user.type(cityTextBox, 'Berlin');
        });

        then("the user should receive a list of cities (suggestions) that match what they've typed", async () => {
            const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
            expect(suggestionListItems.length).toBe(2);
        });
    });

    test('User can select a city from the suggested list.', ({ given, and, when, then }) => {
        let AppComponent;
        let AppDOM;
        let CitySearchDOM;
        let citySearchInput;
        let suggestionListItems;

        given('user was typing "Berlin" in the city textbox', async () => {
            const user = userEvent.setup();
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
            CitySearchDOM = AppDOM.querySelector('#city-search');
            citySearchInput = within(CitySearchDOM).queryByRole('textbox');
            await user.type(citySearchInput, 'Berlin');
        });

        and('the list of suggested cities is showing', async () => {
            // wait for suggestions to appear and capture them
            suggestionListItems = await within(CitySearchDOM).findAllByRole('listitem');
            expect(suggestionListItems.length).toBe(2);
        });

        when('the user selects a city (e.g., "Berlin, Germany") from the list', async () => {
            const user = userEvent.setup();
            // click the first suggestion (expected to be 'Berlin, Germany')
            await user.click(suggestionListItems[0]);
        });

        then('their city should be changed to that city (i.e., "Berlin, Germany")', () => {
            expect(citySearchInput.value).toBe('Berlin, Germany');
        });

        and('the user should receive a list of upcoming events in that city', async () => {
            const EventListDOM = AppDOM.querySelector('#event-list');
            const EventListItems = await within(EventListDOM).findAllByRole('listitem');
            const allEvents = await getEvents();
            const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');
            expect(EventListItems.length).toBe(berlinEvents.length);
        });
    });
});

