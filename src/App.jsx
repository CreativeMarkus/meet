import React from 'react'; // eslint-disable-line no-unused-vars
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';

const App = () => {
  return (
    <div className="App">
      <NumberOfEvents />
      <EventList />
    </div>
  );
}

export default App;