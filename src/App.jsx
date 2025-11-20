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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Clear any existing token and start fresh OAuth flow
      localStorage.removeItem('access_token');
      
      // Import the getAccessToken function and trigger OAuth
      const { getAccessToken } = await import('./api');
      await getAccessToken();
    } catch (error) {
      setIsLoading(false);
      console.error('Sign-in error:', error);
    }
  };

  // Show sign-in screen if not authenticated
  if (authError || isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h1 style={{ color: '#333', marginBottom: '10px' }}>Meet App</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Discover events happening around the world
            </p>
            
            {isLoading ? (
              <div>
                <div style={{ marginBottom: '20px' }}>🔄</div>
                <p>Connecting to Google...</p>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#3367d6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }  return (
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