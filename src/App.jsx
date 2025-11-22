import { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import { extractLocations, getEvents, isAuthenticated } from './api';
import mockData from './mock-data';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [isLoading, setIsLoading] = useState(true);
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [warningAlert, setWarningAlert] = useState('');


  useEffect(() => {
    // Check online status and set warning alert
    if (navigator.onLine) {
      setWarningAlert('');
    } else {
      setWarningAlert('You are currently offline. The displayed events may not be up to date.');
    }

    let isMounted = true;

    const handleOAuthFlow = async () => {
      try {
        if (import.meta.env.MODE === 'test' || import.meta.env.MODE === 'development') {
          console.log('Development/Test environment detected, using mock data (no authentication required)');
          setAllEvents(mockData);
          const filteredEvents = currentCity === 'See all cities'
            ? mockData
            : mockData.filter((event) => event.location === currentCity);
          setEvents(filteredEvents.slice(0, currentNOE));
          setAllLocations(extractLocations(mockData));
          setIsLoading(false);
          return;
        }

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
          // Direct redirect to Google consent screen with correct Client ID
          console.log('User not authenticated, redirecting to Google consent screen...');

          // Google OAuth 2.0 configuration with CORRECT Client ID
          const clientId = '182267910547-sc4sjg9f41tvf1dcjplmqpb0q1s6b4gp.apps.googleusercontent.com';
          const redirectUri = `${window.location.origin}/`;
          const scope = 'https://www.googleapis.com/auth/calendar.events.readonly';

          console.log('Using correct Client ID:', clientId);
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

          // Prevent actual redirect during tests (JSDOM doesn't support navigation)
          try {
            window.location.href = authUrl;
          } catch (error) {
            console.log('Navigation blocked (likely in test environment):', error.message);
            // In test environment, just continue to load mock data
          }
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

        setAllEvents(allEvents);
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
          setAllEvents(mockData);
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

  // PWA Install Prompt Handler - Allow automatic browser prompts
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      console.log('PWA install prompt is available', event);
      // Don't call preventDefault() - let the browser show automatic prompts
      console.log('Automatic install prompt should appear');
    };

    const handleAppInstalled = (event) => {
      console.log('App was installed successfully', event);
    };

    // Register service worker manually to ensure it's active
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

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
      <h1>Meet App</h1>
      <div className="alerts-container">
        {infoAlert.length > 0 && <InfoAlert text={infoAlert} />}
        {errorAlert.length > 0 && <ErrorAlert text={errorAlert} />}
        {warningAlert.length > 0 && <WarningAlert text={warningAlert} />}
      </div>

      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} setInfoAlert={setInfoAlert} />
      <NumberOfEvents setCurrentNOE={setCurrentNOE} setErrorAlert={setErrorAlert} />
      <div className="charts-container">
        <EventGenresChart events={events} />
        <CityEventsChart allLocations={allLocations} events={allEvents} />
      </div>
      <EventList events={events} />
    </div>
  );
}

export default App;