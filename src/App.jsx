import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { extractLocations, getEvents, isAuthenticated } from './api';
import mockData from './mock-data';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [isLoading, setIsLoading] = useState(true);
  const [userAuthorized, setUserAuthorized] = useState(true); // Assume authorized until checked

  // Function to validate if user is in authorized test users list
  const validateTestUser = async (accessToken) => {
    try {
      // Get user info from Google
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
      const userInfo = await response.json();

      if (userInfo.email) {
        console.log('User email:', userInfo.email);
        const isAuthorized = AUTHORIZED_TEST_USERS.includes(userInfo.email.toLowerCase());
        console.log('User authorized:', isAuthorized);
        return isAuthorized;
      }
      return false;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  };

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
          allEvents = mockData;
        }

        if (!isMounted) return;

        // Ensure we have events to display
        if (!allEvents || allEvents.length === 0) {
          console.log('No events found, using mock data');
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

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
}

export default App;