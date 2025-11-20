import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated } from './api';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);

  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadApp = async () => {
      try {
        // Try to get events - this will trigger OAuth if needed
        const allEvents = await getEvents();
        if (!isMounted) return;

        const filteredEvents = currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load app:', error);
        // If error, the OAuth redirect should have already happened
        setIsLoading(false);
      }
    };

    loadApp();

    return () => { isMounted = false; };
  }, [currentCity, currentNOE]);

  // Show simple loading while redirecting to Google or loading data
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Redirecting to Google Sign-In...</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div style={{ padding: '10px', background: '#e8f5e8', marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ margin: '0', color: '#2e7d32' }}>
          ✅ Authenticated with Google - Showing your calendar events
        </p>
      </div>
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
}

export default App;