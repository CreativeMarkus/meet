/* eslint-env jest */
// src/__tests__/NumberOfEvents.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
    test('contains an element with role textbox', () => {
        const { getByRole } = render(<NumberOfEvents />);
        expect(getByRole('textbox')).toBeInTheDocument();
    });

    test('default value is 32', () => {
        const { getByRole } = render(<NumberOfEvents />);
        const input = getByRole('textbox');
        expect(input).toHaveValue(32);
    });

    test('value changes when user types', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<NumberOfEvents />);
        const input = getByRole('textbox');
        // simulate deleting '32' and typing '10'
        await user.type(input, '{backspace}{backspace}10');
        expect(input).toHaveValue(10);
    });
});
