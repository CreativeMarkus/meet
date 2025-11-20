import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents } from './api';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);

  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [oauthEnabled, setOauthEnabled] = useState(localStorage.getItem('forceOAuth') === 'true');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const allEvents = await getEvents();
      if (!isMounted) return;

      const filteredEvents = currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((event) => event.location === currentCity);
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    };

    fetchData();

    return () => { isMounted = false; };
  }, [currentCity, currentNOE]);

  const toggleOAuth = () => {
    const newOAuthState = !oauthEnabled;
    setOauthEnabled(newOAuthState);
    localStorage.setItem('forceOAuth', newOAuthState.toString());
    // Clear any existing access token to force re-authentication
    localStorage.removeItem('access_token');
    // Reload to apply OAuth changes
    window.location.reload();
  };

  return (
    <div className="App">
      <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <button
          onClick={toggleOAuth}
          style={{
            backgroundColor: oauthEnabled ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {oauthEnabled ? '🔓 OAuth Enabled' : '🔒 OAuth Disabled'} (Click to toggle)
        </button>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
          {oauthEnabled ? 'Using Google OAuth for real events' : 'Using mock data for development'}
        </p>
      </div>
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
}

export default App;