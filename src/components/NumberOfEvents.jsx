import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const NumberOfEvents = ({ defaultNumber = 32 }) => {
    const [number, setNumber] = useState(defaultNumber);

    const handleInputChanged = (e) => {
        const val = e.target.value;
        // store as number when possible
        const num = val === '' ? '' : Number(val);
        setNumber(num);
    };

    return (
        <div id="number-of-events">
            <label htmlFor="number-input">Number of events:</label>
            <input
                id="number-input"
                type="number"
                role="textbox"
                value={number}
                onChange={handleInputChanged}
            />
        </div>
    );
};

NumberOfEvents.propTypes = {
    defaultNumber: PropTypes.number,
};

export default NumberOfEvents;
