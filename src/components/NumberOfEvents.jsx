import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert, defaultNumber = 32 }) => {
    const [number, setNumber] = useState(defaultNumber);
    const [localError, setLocalError] = useState('');

    const handleInputChanged = (e) => {
        const val = e.target.value;
        const num = val === '' ? '' : Number(val);

        // Validation logic for error alerts
        const errorMsg = val !== '' && (isNaN(num) || num <= 0) ? 'Please enter a valid number greater than zero' : '';

        setLocalError(errorMsg);
        if (setErrorAlert) {
            setErrorAlert(errorMsg);
        }

        setNumber(num);
        if (setCurrentNOE && val !== '' && !isNaN(num) && num > 0) {
            setCurrentNOE(Number(val));
        }
    };

    return (
        <div id="number-of-events" data-testid="number-of-events">
            <label htmlFor="number-input">Number of events:</label>
            <input
                id="number-input"
                type="number"
                role="textbox"
                value={number}
                onChange={handleInputChanged}
            />
            {localError && <div className="error-message">{localError}</div>}
        </div>
    );
};

NumberOfEvents.propTypes = {
    defaultNumber: PropTypes.number,
    setCurrentNOE: PropTypes.func,
    setErrorAlert: PropTypes.func,
};

export default NumberOfEvents;
