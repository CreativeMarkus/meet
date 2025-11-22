/* eslint-env jest */
import { loadFeature, defineFeature } from 'jest-cucumber';
import React from 'react'; // eslint-disable-line no-unused-vars
import { render, within, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import mockData from '../mock-data';

jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
    };
});

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
    test("When user hasn’t specified a number, 32 events are shown by default", ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;

        given("the user hasn't specified a number of events", () => {
        });

        when('the user opens the app', async () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
            await waitFor(() => {
                const EventListDOM = AppDOM.querySelector('#event-list');
                const items = within(EventListDOM).queryAllByRole('listitem');
                expect(items.length).toBeGreaterThan(0);
            });
        });

        then('32 events are displayed', async () => {
            await waitFor(() => {
                const EventListDOM = AppDOM.querySelector('#event-list');
                const items = within(EventListDOM).queryAllByRole('listitem');
                expect(items.length).toBe(32);
            });
        });
    });

    test('User can change the number of events displayed', ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;
        let numberInput;

        given('the user is viewing the list of events', async () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
            await waitFor(() => {
                expect(AppDOM.querySelector('#number-of-events')).toBeInTheDocument();
            });
            const numberContainer = AppDOM.querySelector('#number-of-events');
            numberInput = within(numberContainer).queryByRole('textbox');
        });

        when('the user sets the number of events to 5', async () => {
            const user = userEvent.setup();
            await user.clear(numberInput);
            await user.type(numberInput, '5');
        });

        then('only 5 events are displayed', async () => {
            await waitFor(() => {
                const EventListDOM = AppDOM.querySelector('#event-list');
                const items = within(EventListDOM).queryAllByRole('listitem');
                expect(items.length).toBe(5);
            });
        });
    });
});

afterEach(() => {
    cleanup();
});
