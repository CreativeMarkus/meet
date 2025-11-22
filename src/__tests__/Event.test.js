/* eslint-env jest */
// src/__tests__/Event.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import { getEvents } from '../api';

describe('<Event /> component', () => {
    test('renders event title, start time and location', async () => {
        const allEvents = await getEvents();
        const event = allEvents[0];

        render(<Event event={event} />);

        expect(await screen.findByText(event.summary)).toBeInTheDocument();
        expect(await screen.findByText(event.created)).toBeInTheDocument();
        expect(await screen.findByText(event.location)).toBeInTheDocument();
    });

    test('show/hide details when button is clicked', async () => {
        const allEvents = await getEvents();
        const event = allEvents[0];

        const user = userEvent.setup();
        const { container } = render(<Event event={event} />);

        expect(container.querySelector('.details')).not.toBeInTheDocument();

        const detailsButton = await screen.findByText(/show details/i);
        await user.click(detailsButton);

        expect(container.querySelector('.details')).toBeInTheDocument();
        if (event.description) {
            expect(container.querySelector('.description')).toBeInTheDocument();
        }

        expect(await screen.findByText(/hide details/i)).toBeInTheDocument();

        await user.click(await screen.findByText(/hide details/i));
        expect(container.querySelector('.details')).not.toBeInTheDocument();
    });
});