/* eslint-env jest */
// src/__tests__/CitySearch.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import mockData from '../mock-data';

// helper to simulate API getEvents
const getEvents = async () => {
    // mockData file in this workspace may contain large JSON; ensure we return an array
    if (Array.isArray(mockData) && mockData.length > 0) return mockData;
    // fallback sample events
    return [
        { location: 'Berlin, Germany' },
        { location: 'London, UK' },
        { location: 'Berlin, Germany' },
    ];
};

const extractLocations = (events) => {
    if (!Array.isArray(events)) return [];
    const extract = events.map((event) => event.location);
    // return unique locations
    return Array.from(new Set(extract));
};

describe('<CitySearch /> component', () => {
    let CitySearchComponent;
    beforeEach(() => {
        CitySearchComponent = render(<CitySearch />);
    });

    test('renders text input', () => {
        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        expect(cityTextBox).toBeInTheDocument();
        expect(cityTextBox).toHaveClass('city');
    });

    test('suggestions list is hidden by default', () => {
        const suggestionList = CitySearchComponent.queryByRole('list');
        expect(suggestionList).not.toBeInTheDocument();
    });


    test('renders a list of suggestions when city textbox gains focus', async () => {
        const user = userEvent.setup();
        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        await user.click(cityTextBox);
        const suggestionList = CitySearchComponent.queryByRole('list');
        expect(suggestionList).toBeInTheDocument();
        expect(suggestionList).toHaveClass('suggestions');
    });


    test('updates list of suggestions correctly when user types in city textbox', async () => {
        const user = userEvent.setup();
        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);
        CitySearchComponent.rerender(<CitySearch allLocations={allLocations} />);


        // user types "Berlin" in city textbox
        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        await user.type(cityTextBox, "Berlin");


        // filter allLocations to locations matching "Berlin"
        const suggestions = allLocations
            ? allLocations.filter((location) => {
                return (
                    location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1
                );
            })
            : [];


        // get all <li> elements inside the suggestion list
        const suggestionListItems = CitySearchComponent.queryAllByRole('listitem');
        expect(suggestionListItems).toHaveLength(suggestions.length + 1);
        for (let i = 0; i < suggestions.length; i += 1) {
            expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
        }
    });
});
