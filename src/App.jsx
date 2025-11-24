import { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';
import { InfoAlert, WarningAlert } from './components/Alert';
import { extractLocations } from './api';
import mockData from './mock-data';

import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [isLoading, setIsLoading] = useState(true);
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    if (navigator.onLine) {
      setWarningAlert('');
    } else {
      setWarningAlert(
        'You are currently offline. The displayed events may not be up to date.'
      );
    }

    let isMounted = true;

    const handleOAuthFlow = async () => {
      try {
        console.log('Environment MODE:', import.meta.env.MODE);
        console.log('Using mock data (no authentication required)');
        console.log('Mock data length:', mockData.length);

        setAllEvents(mockData);

        const mockFilteredEvents =
          currentCity === 'See all cities'
            ? mockData
            : mockData.filter((event) => event.location === currentCity);

        console.log('Filtered events length:', mockFilteredEvents.length);

        setEvents(mockFilteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(mockData));
        setIsLoading(false);
        return;
      } catch (error) {
        if (!isMounted) return;

        console.error('OAuth flow error:', error);

        try {
          setAllEvents(mockData);

          const filteredEvents =
            currentCity === 'See all cities'
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

    return () => {
      isMounted = false;
    };
  }, [currentNOE, currentCity]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      console.log('PWA install prompt is available', event);
      console.log('Automatic install prompt should appear');
    };

    const handleAppInstalled = (event) => {
      console.log('App was installed successfully', event);
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
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
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Loading events...</div>
          <div className="loading-subtext">Please wait while we fetch the latest data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Meet App</h1>


      <div className="alerts-container">
        {infoAlert.length > 0 && <InfoAlert text={infoAlert} />}
        {warningAlert.length > 0 && <WarningAlert text={warningAlert} />}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />

      <NumberOfEvents
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />

      <div className="charts-container">
        <EventGenresChart events={events} />
        <CityEventsChart allLocations={allLocations} events={allEvents} />
      </div>

      <EventList events={events} />
    </div>
  );
};

export default App;
