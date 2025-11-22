/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, waitFor, within, screen, cleanup } from '@testing-library/react';
import mockData from '../mock-data';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
    };
});

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
    test('An event element is collapsed by default', ({ given, when, then }) => {
        given('the user has opened the app', async () => {
            render(<App />);
            await screen.findAllByRole('listitem');
        });

        when('the user views the list of events', async () => {
            const events = await screen.findAllByRole('listitem');
            expect(events.length).toBeGreaterThan(0);
        });

        then('the details for each event should be hidden by default', async () => {
            const events = await screen.findAllByRole('listitem');
            const firstEvent = events[0];
            expect(firstEvent).toBeDefined();
            const button = within(firstEvent).getByRole('button');
            expect(button).toHaveTextContent(/show details/i);
            const description = within(firstEvent).queryByText(/Have you wondered how you can ask Google/i);
            expect(description).toBeNull();
        });
    });

    test('User can expand an event to see details', ({ given, and, when, then }) => {
        given('the user has opened the app', async () => {
            render(<App />);
            await screen.findAllByRole('listitem');
        });

        and('the list of events is displayed', async () => {
            const events = await screen.findAllByRole('listitem');
            expect(events.length).toBeGreaterThan(0);
        });

        when('the user expands an event', async () => {
            const user = userEvent.setup();
            const events = await screen.findAllByRole('listitem');
            const firstEvent = events[0];
            const button = within(firstEvent).getByRole('button');
            await user.click(button);
        });

        then("the event's details should be shown", async () => {
            const descriptionNode = await screen.findByText(/Have you wondered how you can ask Google/i);
            expect(descriptionNode).toBeInTheDocument();
            const events = await screen.findAllByRole('listitem');
            const firstEvent = events[0];
            const button = within(firstEvent).getByRole('button');
            expect(button).toHaveTextContent(/hide details/i);
        });
    });

    test("User can collapse an event to hide details", ({ given, when, then }) => {
        given("an event's details are currently visible", async () => {
            const user = userEvent.setup();
            render(<App />);
            const events = await screen.findAllByRole('listitem');
            const firstEvent = events[0];
            const button = within(firstEvent).getByRole('button');
            await user.click(button);
            await screen.findByText(/Have you wondered how you can ask Google/i);
        });

        when('the user collapses the event', async () => {
            const user = userEvent.setup();
            const events = await screen.findAllByRole('listitem');
            const firstEvent = events[0];
            const button = within(firstEvent).getByRole('button');
            await user.click(button);
        });
        then("the event's details should be hidden", async () => {
            await waitFor(() => {
                const description = screen.queryByText(/Have you wondered how you can ask Google/i);
                expect(description).toBeNull();
            });
        });
    });
});

afterEach(() => {
    cleanup();
});