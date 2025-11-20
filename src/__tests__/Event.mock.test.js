/* eslint-env jest */
// src/__tests__/Event.mock.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';

const mockEvent = {
    summary: 'Mocked Event Title',
    created: '2021-07-01T12:00:00.000Z',
    location: 'Berlin, Germany',
    description: 'This is a mocked event description for testing purposes.'
};

describe('<Event /> component (mocked data)', () => {
    test('renders event title, start time and location from mocked event', async () => {
        render(<Event event={mockEvent} />);

        expect(await screen.findByText(mockEvent.summary)).toBeInTheDocument();
        expect(await screen.findByText(mockEvent.created)).toBeInTheDocument();
        expect(await screen.findByText(mockEvent.location)).toBeInTheDocument();
    });

    test('toggles details when show/hide button is clicked (mocked event)', async () => {
        const user = userEvent.setup();
        const { container } = render(<Event event={mockEvent} />);

        expect(container.querySelector('.details')).not.toBeInTheDocument();

        await user.click(await screen.findByText(/show details/i));
        expect(container.querySelector('.details')).toBeInTheDocument();
        expect(container.querySelector('.description')).toBeInTheDocument();

        await user.click(await screen.findByText(/hide details/i));
        expect(container.querySelector('.details')).not.toBeInTheDocument();
    });
});