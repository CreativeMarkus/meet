/* eslint-env jest */
// src/__tests__/EventList.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';


describe('<EventList /> component', () => {
    test('has an element with "list" role', () => {
        const EventListComponent = render(<EventList />);
        expect(EventListComponent.queryByRole("list")).toBeInTheDocument();
    });

    test('renders correct number of events', async () => {
        const EventListComponent = render(<EventList />);
        const allEvents = await getEvents();
        EventListComponent.rerender(<EventList events={allEvents} />);
        expect(EventListComponent.getAllByRole("listitem")).toHaveLength(allEvents.length);
    });
});