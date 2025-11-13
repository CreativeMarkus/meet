import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const NumberOfEvents = ({ setCurrentNOE, defaultNumber = 32 }) => {
    const [number, setNumber] = useState(defaultNumber);

    const handleInputChanged = (e) => {
        const val = e.target.value;
        const num = val === '' ? '' : Number(val);
        setNumber(num);
        if (setCurrentNOE && val !== '') {
            setCurrentNOE(Number(val));
        }
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
    setCurrentNOE: PropTypes.func,
};

export default NumberOfEvents;
