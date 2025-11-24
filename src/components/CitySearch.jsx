import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [localInfoAlert, setLocalInfoAlert] = useState('');

    useEffect(() => {
        setSuggestions(allLocations);
    }, [allLocations]);

    const handleInputChanged = (event) => {
        const value = event.target.value;
        const filteredLocations = allLocations
            ? allLocations.filter((location) => {
                return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
            })
            : [];

        setQuery(value);
        setSuggestions(filteredLocations);

        // Clear previous alerts when typing
        setLocalInfoAlert('');
        if (setInfoAlert) {
            setInfoAlert('');
        }
    };

    const handleSearchClick = () => {
        const trimmedQuery = query.trim();
        if (trimmedQuery === '') {
            setLocalInfoAlert('Please enter a city name');
            if (setInfoAlert) {
                setInfoAlert('Please enter a city name');
            }
            return;
        }

        const matchedCity = allLocations.find(location =>
            location.toUpperCase() === trimmedQuery.toUpperCase()
        );

        if (matchedCity) {
            setCurrentCity(matchedCity);
            setShowSuggestions(false);
            setLocalInfoAlert('');
            if (setInfoAlert) {
                setInfoAlert('');
            }
        } else {
            const alertMsg = 'We cannot find the city you are looking for. Please try another city';
            setLocalInfoAlert(alertMsg);
            if (setInfoAlert) {
                setInfoAlert(alertMsg);
            }
        }
    };

    const handleItemClicked = (event) => {
        const value = event.target.textContent;
        setQuery(value);
        setShowSuggestions(false);
        setCurrentCity(value);

        // Clear info alert when city is selected
        setLocalInfoAlert('');
        if (setInfoAlert) {
            setInfoAlert('');
        }
    };

    return (
        <div id="city-search">
            <div className="input-container-wrapper">
                <input
                    type="text"
                    className="city"
                    placeholder="Search for a city"
                    role="textbox"
                    aria-label="City"
                    value={query}
                    onFocus={() => {
                        setShowSuggestions(true);
                        setSuggestions(allLocations || []);
                    }}
                    onChange={handleInputChanged}
                />
                <button
                    type="button"
                    className="city-toggle"
                    aria-expanded={showSuggestions}
                    aria-label={showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                    onClick={() => {
                        const next = !showSuggestions;
                        setShowSuggestions(next);
                        if (next) setSuggestions(allLocations || []);
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <button
                type="button"
                className="search-button"
                onClick={handleSearchClick}
                aria-label="Search for events in this city"
            >
                Get Events
            </button>
            {showSuggestions ? (
                <ul className="suggestions">
                    {suggestions.map((suggestion) => {
                        return (
                            <li onClick={handleItemClicked} key={suggestion}>
                                {suggestion}
                            </li>
                        );
                    })}
                    <li key={"See all cities"} onClick={handleItemClicked}>
                        <b>See all cities</b>
                    </li>
                </ul>
            ) : null}
            {localInfoAlert && <div className="error-message info-message">{localInfoAlert}</div>}
        </div>
    );
};

export default CitySearch;

CitySearch.propTypes = {
    allLocations: PropTypes.arrayOf(PropTypes.string),
    setCurrentCity: PropTypes.func,
    setInfoAlert: PropTypes.func,
};
