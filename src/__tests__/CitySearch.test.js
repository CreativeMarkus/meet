/* eslint-env jest */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getEvents } from '../api';
import mockData from '../mock-data';

jest.mock('../api', () => {
    const actualApi = jest.requireActual('../api');
    return {
        getEvents: jest.fn(() => Promise.resolve(mockData)),
        extractLocations: actualApi.extractLocations,
    };
});

describe('<CitySearch /> component', () => {
    let CitySearchComponent;
    beforeEach(() => {
        CitySearchComponent = render(<CitySearch allLocations={[]} setInfoAlert={() => { }} />);
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
        CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        await user.click(cityTextBox);
        await user.type(cityTextBox, "Berlin");

        const suggestions = allLocations
            ? allLocations.filter((location) => {
                return (
                    location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1
                );
            })
            : [];

        const suggestionListItems = CitySearchComponent.queryAllByRole('listitem');
        expect(suggestionListItems).toHaveLength(suggestions.length + 1);
        for (let i = 0; i < suggestions.length; i += 1) {
            expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
        }
    });

    test('renders "Get Events" search button', () => {
        const searchButton = CitySearchComponent.getByRole('button', { name: /search for events in this city/i });
        expect(searchButton).toBeInTheDocument();
    });

    test('triggers city change when search button is clicked with valid city', async () => {
        const user = userEvent.setup();
        const mockSetCurrentCity = jest.fn();
        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);
        CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={mockSetCurrentCity} setInfoAlert={() => { }} />);

        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        const searchButton = CitySearchComponent.getByRole('button', { name: /search for events in this city/i });

        await user.type(cityTextBox, 'Berlin, Germany');
        await user.click(searchButton);

        expect(mockSetCurrentCity).toHaveBeenCalledWith('Berlin, Germany');
    });

    test('shows error when search button is clicked with invalid city', async () => {
        const user = userEvent.setup();
        const mockSetInfoAlert = jest.fn();
        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);
        CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} setInfoAlert={mockSetInfoAlert} />);

        const cityTextBox = CitySearchComponent.queryByRole('textbox');
        const searchButton = CitySearchComponent.getByRole('button', { name: /search for events in this city/i });

        await user.type(cityTextBox, 'Invalid City');
        await user.click(searchButton);

        expect(mockSetInfoAlert).toHaveBeenCalledWith('We cannot find the city you are looking for. Please try another city');
    });
});


describe('<CitySearch /> integration', () => {
    test('renders suggestions list when the app is rendered.', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;
        await screen.findAllByRole('listitem');


        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const cityTextBox = within(CitySearchDOM).queryByRole('textbox');
        await user.click(cityTextBox);


        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);


        const suggestionListItems = await within(CitySearchDOM).findAllByRole('listitem');
        expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });

});