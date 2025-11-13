/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
    test('An event element is collapsed by default', ({ given, when, then }) => {
        let AppComponent;
        let AppDOM;

        given('the user has opened the app', () => {
            AppComponent = render(<App />);
            AppDOM = AppComponent.container.firstChild;
        });

        when('the user views the list of events', async () => {
            await waitFor(() => {
                expect(AppDOM.querySelector('#event-list .event')).toBeDefined();
            });
        });

        then('the details for each event should be hidden by default', () => {
            const details = AppDOM.querySelectorAll('#event-list .event .details');
            expect(details.length).toBe(0);
        });
    });

    test('User can expand an event to see details', ({ given, and, when, then }) => {
        let AppComponent;
        let AppDOM;

        given('the user has opened the app', () => {
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
            const button = AppDOM.querySelector('#event-list .event .details-btn');
            await user.click(button);
        });

        then("the event's details should be shown", () => {
            const details = AppDOM.querySelector('#event-list .event .details');
            expect(details).toBeDefined();
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
            const button = AppDOM.querySelector('#event-list .event .details-btn');
            await user.click(button);
        });
        then("the event's details should be hidden", async () => {
            await waitFor(() => {
                const details = AppDOM.querySelector('#event-list .event .details');
                expect(details).toBeNull();
            });
        });
    });
});
