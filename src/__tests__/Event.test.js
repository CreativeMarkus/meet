/* eslint-env jest */
// src/__tests__/Event.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import { getEvents } from '../api';

describe('<Event /> component', () => {
    test('renders event title, start time and location', async () => {
        const allEvents = await getEvents();
        const event = allEvents[0];

        const { queryByText } = render(<Event event={event} />);

        expect(queryByText(event.summary)).toBeInTheDocument();
        expect(queryByText(event.created)).toBeInTheDocument();
        expect(queryByText(event.location)).toBeInTheDocument();
    });

    test('show/hide details when button is clicked', async () => {
        const allEvents = await getEvents();
        const event = allEvents[0];

        const user = userEvent.setup();
        const { container, getByText } = render(<Event event={event} />);

        // details should be hidden initially
        expect(container.querySelector('.details')).not.toBeInTheDocument();

        // click show details
        const detailsButton = getByText(/show details/i);
        await user.click(detailsButton);

        // details should be visible
        expect(container.querySelector('.details')).toBeInTheDocument();
        if (event.description) {
            // ensure the description element is rendered (text may contain newlines)
            expect(container.querySelector('.description')).toBeInTheDocument();
        }

        // button text should now be 'Hide details'
        expect(getByText(/hide details/i)).toBeInTheDocument();

        // click hide details
        await user.click(getByText(/hide details/i));
        expect(container.querySelector('.details')).not.toBeInTheDocument();
    });
});
