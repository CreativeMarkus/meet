import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations, setCurrentCity }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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
    };

    const handleItemClicked = (event) => {
        const value = event.target.textContent;
        setQuery(value);
        setShowSuggestions(false);
        setCurrentCity(value);
    };

    return (
        <div id="city-search">
            <input
                type="text"
                className="city"
                placeholder="Search for a city"
                role="textbox"
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
        </div>
    );
};

export default CitySearch;

CitySearch.propTypes = {
    allLocations: PropTypes.arrayOf(PropTypes.string),
    setCurrentCity: PropTypes.func,
};
