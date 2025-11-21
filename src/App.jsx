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


    let isMounted = true;

    const handleOAuthFlow = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          console.log('OAuth code detected, exchanging for access token...');

          const serverlessBaseUrl = 'https://j251282ei3.execute-api.eu-central-1.amazonaws.com/dev';
          const tokenEndpoint = `${serverlessBaseUrl}/api/token/${encodeURIComponent(code)}`;

          const response = await fetch(tokenEndpoint);
          const { access_token } = await response.json();

          if (access_token) {
            localStorage.setItem('access_token', access_token);
            console.log('Access token saved successfully');
          }

          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }

        const authenticated = await isAuthenticated();

        if (!authenticated) {
          // Direct redirect to Google consent screen
          console.log('User not authenticated, redirecting to Google consent screen...');

          // Google OAuth 2.0 configuration - auto-detect current domain
          const clientId = '263620562167-35c6bn2eqh8if4cb6iuugev7fu5ntahn.apps.googleusercontent.com';
          const redirectUri = `${window.location.origin}/`;
          const scope = 'https://www.googleapis.com/auth/calendar.events.readonly';

          console.log('Using redirect URI:', redirectUri);

          // Build Google OAuth URL directly
          const authParams = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: scope,
            access_type: 'offline',
            prompt: 'consent'
          });

          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
          console.log('Redirecting to:', authUrl);

          // Redirect user to Google consent screen
          window.location.href = authUrl;
          return;
        }

        let allEvents;
        try {
          allEvents = await getEvents();
          console.log('Events fetched:', allEvents);
        } catch (error) {
          console.error('Error fetching events, using mock data:', error);
          allEvents = mockData;
        }

        if (!isMounted) return;

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