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
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);

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

        console.error('Authentication or data fetch error:', error);
        setAuthError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [currentCity, currentNOE]);

  const handleRetryAuth = () => {
    // Clear any stored access token and reload to restart OAuth flow
    localStorage.removeItem('access_token');
    window.location.reload();
  };

  // Show loading state while authenticating
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>🔐 Authenticating with Google...</h2>
          <p>Please wait while we verify your credentials.</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (authError) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px', background: '#ffebee' }}>
          <h2>🚫 Authentication Required</h2>
          <p>You must sign in with your Google account to access calendar events.</p>
          <p style={{ color: '#d32f2f', fontSize: '14px' }}>{authError}</p>
          <button
            onClick={handleRetryAuth}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🔄 Try Again
          </button>
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