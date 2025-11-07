/* eslint-env jest */
// src/tests/CitySearch.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';


describe('<CitySearch /> component', () => {
    test('renders without crashing', () => {
        const { getByPlaceholderText } = render(<CitySearch />);
        expect(getByPlaceholderText('Search for a city')).toBeInTheDocument();
    });

    test('allows typing in the city textbox', async () => {
        const { getByPlaceholderText } = render(<CitySearch />);
        const user = userEvent.setup();
        const input = getByPlaceholderText('Search for a city');
        await user.type(input, 'Berlin');
        expect(input).toHaveValue('Berlin');
    });
});
