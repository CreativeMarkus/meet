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
    // Copilot: Implement Google OAuth login handling for React app
    // 1. Detect if URL has `?code=` from Google redirect.
    // 2. Send the code to backend API to exchange for access token.
    // 3. Save the token in localStorage or state.
    // 4. Remove the `?code=` from URL to prevent 404.
    // 5. Show a loading message while processing.
    // 6. Handle errors gracefully.

    let isMounted = true;

    const handleOAuthFlow = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          // Step 1: Code detected from Google redirect
          console.log('OAuth code detected, exchanging for access token...');

          // Step 2: Send code to backend API to exchange for access token
          const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
          const tokenEndpoint = `${serverlessBaseUrl}/api/token/${encodeURIComponent(code)}`;

          const response = await fetch(tokenEndpoint);
          const { access_token } = await response.json();

          if (access_token) {
            // Step 3: Save token in localStorage
            localStorage.setItem('access_token', access_token);
            console.log('Access token saved successfully');
          }

          // Step 4: Remove the `?code=` from URL to prevent 404
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }

        // Check if user is authenticated (either from new token or existing)
        const authenticated = await isAuthenticated();

        if (!authenticated) {
          // Not authenticated - redirect to Google OAuth
          const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
          const authResponse = await fetch(`${serverlessBaseUrl}/api/get-auth-url`);
          const { authUrl } = await authResponse.json();
          window.location.href = authUrl;
          return;
        }

        // User is authenticated - load calendar events
        let allEvents;
        try {
          allEvents = await getEvents();
          console.log('Events fetched:', allEvents);
        } catch (error) {
          console.error('Error fetching events, using mock data:', error);
          // Fallback to mock data if calendar API fails
          const { default: mockData } = await import('./mock-data');
          allEvents = mockData;
        }

        if (!isMounted) return;

        // Ensure we have events to display
        if (!allEvents || allEvents.length === 0) {
          console.log('No events found, using mock data');
          const { default: mockData } = await import('./mock-data');
          allEvents = mockData;
        }

        const filteredEvents = currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter((event) => event.location === currentCity);
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));
        setIsLoading(false);

      } catch (error) {
        if (!isMounted) return;
        console.error('OAuth flow error:', error);
        // Fallback to mock data on any error
        try {
          const { default: mockData } = await import('./mock-data');
          const filteredEvents = currentCity === 'See all cities'
            ? mockData
            : mockData.filter((event) => event.location === currentCity);
          setEvents(filteredEvents.slice(0, currentNOE));
          setAllLocations(extractLocations(mockData));
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
        setIsLoading(false);
      }
    };

    handleOAuthFlow();

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

  const handleLogout = () => {
    // Clear access token and reload to restart OAuth flow
    localStorage.removeItem('access_token');
    alert('You have been logged out. You will be redirected to sign in again.');
    window.location.reload();
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0', color: '#333' }}>Meet App</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          🚪 Logout
        </button>
      </div>
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
}

export default App;