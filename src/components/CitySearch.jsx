import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations = [] }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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
    };

    return (
        <div id="city-search">
            <input
                type="text"
                className="city"
                placeholder="Search for a city"
                role="textbox"
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={handleInputChanged}
            />
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
};
