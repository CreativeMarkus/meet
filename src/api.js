import mockData from './mock-data';

/**
 * Return an array of unique locations from an events array.
 * @param {Array} events
 * @returns {Array<string>}
 */
export const extractLocations = (events) => {
    if (!Array.isArray(events)) return [];
    const extractedLocations = events.map((event) => event.location);
    const locations = [...new Set(extractedLocations)];
    return locations;
};

/**
 * Async function that returns events data. Currently returns local mock data.
 * @returns {Promise<Array>}
 */
export const getEvents = async () => {
    return mockData;
};
