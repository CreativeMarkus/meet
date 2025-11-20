/* eslint-env jest */
// src/__tests__/NumberOfEvents.test.js
import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
    test('contains an element with role textbox', () => {
        const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => { }} />);
        expect(getByRole('textbox')).toBeInTheDocument();
    });

    test('default value is 32', () => {
        const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => { }} />);
        const input = getByRole('textbox');
        expect(input).toHaveValue(32);
    });

    test('value changes when user types', async () => {
        const user = userEvent.setup();
        const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => { }} />);
        const input = getByRole('textbox');
        await user.type(input, '{backspace}{backspace}10');
        expect(input).toHaveValue(10);
    });
});