/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';
import mockData from '../mock-data';

jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
    };
});

const feature = loadFeature('./src/features/filterEventsByCity.feature');

defineFeature(feature, test => {
    test("When user hasn't searched for a city, show upcoming events from all cities.", ({ given, when, then }) => {

        given("user hasn't searched for any city", () => {
        });

        when('the user opens the app', async () => {
            render(<App />);
            await screen.findAllByRole('listitem');
        });

        then('the user should see the list of all upcoming events.', async () => {
            const items = await screen.findAllByRole('listitem');
            expect(items.length).toBe(32);
        });
    });

    test('User should see a list of suggestions when they search for a city.', ({ given, when, then }) => {
        let CitySearchDOM;
        let cityTextBox;

        given('the main page is open', async () => {
            const AppComponent = render(<App />);
            const AppDOM = AppComponent.container.firstChild;
            CitySearchDOM = AppDOM.querySelector('#city-search');
            cityTextBox = screen.getByPlaceholderText('Search for a city');
            await screen.findAllByRole('listitem');
        });

        when('user starts typing in the city textbox', async () => {
            const user = userEvent.setup();
            await user.type(cityTextBox, 'Berlin');
        });

        then("the user should receive a list of cities (suggestions) that match what they've typed", async () => {
            const suggestionListItems = await within(CitySearchDOM).findAllByRole('listitem');
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
            citySearchInput = screen.getByPlaceholderText('Search for a city');
            await screen.findAllByRole('listitem');
            await user.click(citySearchInput);
            await user.type(citySearchInput, 'Berlin');
        });

        and('the list of suggested cities is showing', async () => {
            suggestionListItems = await within(CitySearchDOM).findAllByRole('listitem');
            expect(suggestionListItems.length).toBe(2);
        });

        when('the user selects a city (e.g., "Berlin, Germany") from the list', async () => {
            const user = userEvent.setup();
            await user.click(suggestionListItems[0]);
        });

        then('their city should be changed to that city (i.e., "Berlin, Germany")', async () => {
            await waitFor(() => {
                expect(citySearchInput.value).toBe('Berlin, Germany');
            });
        });

        and('the user should receive a list of upcoming events in that city', async () => {
            const EventListDOM = AppDOM.querySelector('#event-list');
            const EventListItems = await within(EventListDOM).findAllByRole('listitem');
            const allEvents = await getEvents();
            const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');
            expect(EventListItems.length).toBe(berlinEvents.length);
        });
    });

    test('User can search for events using the Get Events button.', ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;
        let CitySearchDOM;
        let citySearchInput;
        let searchButton;

        given('the main page is open', async () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
            CitySearchDOM = AppDOM.querySelector('#city-search');
            citySearchInput = screen.getByPlaceholderText('Search for a city');
            searchButton = within(CitySearchDOM).getByRole('button', { name: /get events/i });
            await screen.findAllByRole('listitem');
        });

        when('user types a city name and clicks the Get Events button', async () => {
            const user = userEvent.setup();
            await user.type(citySearchInput, 'Berlin, Germany');
            await user.click(searchButton);
        });

        then('the user should receive a list of upcoming events in that city', async () => {
            const EventListDOM = AppDOM.querySelector('#event-list');
            const EventListItems = await within(EventListDOM).findAllByRole('listitem');
            const allEvents = await getEvents();
            const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');
            expect(EventListItems.length).toBe(berlinEvents.length);
        });
    });
});

afterEach(() => {
    cleanup();
});