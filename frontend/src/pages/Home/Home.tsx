import axios from 'axios';
import { EventProps } from 'pages/Props/Event';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import EventContainer from '../../components/EventContainer/EventContainer';
import theme from '../../theme';
import JoinButton from '../../components/Button/JoinButton';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  React.useEffect(() => {
    getEvent();
  }, []);

  async function getEvent() {
    const response = await axios.get('api/event');
    setEvents(response.data);
    console.log(response);
  }

  return (
    <>
      {/* <CheckboxListSecondary /> */}
      <h1>Home</h1>
      <h3>Exemple des boutons d'events. Ajouter des events pour tester</h3>
      <div style={{ flexDirection: 'column' }}>
        {events.length > 0 &&
          events.map((event) => (
            <EventContainer event={event} key={event.slug} />
          ))}
        <JoinButton variant="shotgun" person={9} maxPerson={10} participating />
        <JoinButton
          variant="form"
          person={5}
          maxPerson={10}
          link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          participating={false}
        />
      </div>
    </>
  );
}

export default Home;
