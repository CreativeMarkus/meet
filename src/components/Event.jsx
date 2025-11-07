import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';


const Event = ({ event }) => {
    const [showDetails, setShowDetails] = useState(false);

    if (!event) return null;

    const handleToggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    return (
        <li className="event">
            <h2 className="summary">{event.summary}</h2>
            <p className="start">{event.created}</p>
            <p className="location">{event.location}</p>

            <button className="details-btn" onClick={handleToggleDetails}>
                {showDetails ? 'Hide details' : 'Show details'}
            </button>

            {showDetails ? (
                <div className="details">
                    {event.description ? (
                        <p className="description">{event.description}</p>
                    ) : null}
                </div>
            ) : null}
        </li>
    );
}


Event.propTypes = {
    event: PropTypes.object,
};

export default Event;
