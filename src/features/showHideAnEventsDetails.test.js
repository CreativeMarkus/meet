/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, waitFor, within } from '@testing-library/react';
import mockData from '../mock-data';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock api calls so tests don't perform network requests
jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
        // include other exports if needed
    };
});

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
    test('An event element is collapsed by default', ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;

        given('the user has opened the app', async () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
        });

        when('the user views the list of events', async () => {
            await waitFor(() => {
                expect(AppDOM.querySelector('#event-list .event')).toBeDefined();
            });
        });

        then('the details for each event should be hidden by default', async () => {
            // wait for the events to render and assert the first event's button shows 'Show details'
            await waitFor(() => {
                const firstEvent = AppDOM.querySelector('#event-list .event');
                expect(firstEvent).toBeDefined();
                const button = within(firstEvent).getByRole('button');
                expect(button.textContent.toLowerCase()).toContain('show details');
            });
        });
    });

    test('User can expand an event to see details', ({ given, and, when, then }) => {
        let AppComponent;
        let AppDOM;

        given('the user has opened the app', async () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
        });

        and('the list of events is displayed', async () => {
            await waitFor(() => {
                expect(AppDOM.querySelector('#event-list .event')).toBeDefined();
            });
        });

        when('the user expands an event', async () => {
            const user = userEvent.setup();
            // target the first event's details button to avoid ambiguity
            const firstEvent = AppDOM.querySelector('#event-list .event');
            await waitFor(() => expect(firstEvent).toBeDefined());
            const button = within(firstEvent).getByRole('button');
            await user.click(button);
        });

        then("the event's details should be shown", async () => {
            await waitFor(() => {
                const firstEvent = AppDOM.querySelector('#event-list .event');
                const button = within(firstEvent).getByRole('button');
                expect(button.textContent.toLowerCase()).toContain('hide details');
                const details = firstEvent.querySelector('.details');
                expect(details).toBeDefined();
                expect(details).toBeVisible();
            });
        });
    });

    test("User can collapse an event to hide details", ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;

        given("an event's details are currently visible", async () => {
            const user = userEvent.setup();
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
            // open the first event's details
            const button = await waitFor(() => AppDOM.querySelector('#event-list .event .details-btn'));
            await user.click(button);
            await waitFor(() => {
                expect(AppDOM.querySelector('#event-list .event .details')).toBeDefined();
            });
        });

        when('the user collapses the event', async () => {
            const user = userEvent.setup();
            const firstEvent = AppDOM.querySelector('#event-list .event');
            await waitFor(() => expect(firstEvent).toBeDefined());
            const button = within(firstEvent).getByRole('button');
            await user.click(button);
        });
        then("the event's details should be hidden", async () => {
            await waitFor(() => {
                const firstEvent = AppDOM.querySelector('#event-list .event');
                const button = within(firstEvent).getByRole('button');
                expect(button.textContent.toLowerCase()).toContain('show details');
                const details = firstEvent.querySelector('.details');
                expect(details).toBeNull();
            });
        });
    });
});
