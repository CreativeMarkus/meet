import { useEffect, useState } from 'react';
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

          console.log('Current window.location.origin:', window.location.origin);
          console.log('Using redirect URI:', redirectUri);
          console.log('Client ID:', clientId);

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
          console.log('Full OAuth URL:', authUrl);

          // Add a small delay so logs are visible
          setTimeout(() => {
            console.log('Redirecting to Google OAuth...');
            window.location.href = authUrl;
          }, 2000);
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