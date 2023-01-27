import { SvgIcon } from '@mui/material';
import axios from 'axios';
import { EventProps } from 'pages/Props/Event';
import React from 'react';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import JoinButton from '../../components/Button/JoinButton';
import './Home.scss';
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
      <div className="header">
        <img
          className="header-image"
          alt="img"
          src="https://www.ec-nantes.fr/medias/photo/carroussel-campus-drone-002_1524738012430-jpg"
        />
        <div id="header-title">
          <text id="second-title">Bienvenue sur</text>
          <div id="title">
            <SvgIcon
              component={NantralIcon}
              inheritViewBox
              sx={{ height: 50, width: 50 }}
            />
            <p id="main-title">Nantral Platform</p>
          </div>
        </div>
      </div>
      <div style={{ margin: 10 }}>
        <h1>Annonces</h1>
        <h1>Mes événements</h1>
        <h1>Evénements à venir</h1>
        <h3>
          Exemple des boutons d&apos;events. Ajouter des events pour tester
        </h3>
        <div style={{ flexDirection: 'column' }}>
          {events.length > 0 &&
            events.map((event) => (
              <JoinButton
                variant={event.max_participant === null ? 'normal' : 'shotgun'}
                person={event.number_of_participants}
                maxPerson={event.max_participant}
                participating={event.is_participating}
                key={event.slug}
              />
            ))}
          <JoinButton
            variant="shotgun"
            person={9}
            maxPerson={10}
            participating
          />
          <JoinButton
            variant="form"
            person={5}
            maxPerson={10}
            link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            participating={false}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
