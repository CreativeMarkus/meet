// src/components/EventList.js
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Event from './Event';


const EventList = ({ events = [] }) => {
    return (
        <ul id="event-list" data-testid="event-list">
            {events.map((event, index) => (
                <Event key={index} event={event} />
            ))}
        </ul>
    );
}


export default EventList;

EventList.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object),
};