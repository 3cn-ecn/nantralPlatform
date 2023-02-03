import { Button, Card, Grid, Skeleton, SvgIcon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { EventProps } from 'pages/Props/Event';
import React from 'react';
import EventCard from '../../components/EventCard/EventCard';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const { t } = useTranslation('translation'); // translation module
  const headerImageURL =
    'https://www.ec-nantes.fr/medias/photo/carroussel-campus-drone-002_1524738012430-jpg';
  React.useEffect(() => {
    getEvent();
  }, []);

  async function getEvent() {
    const response = await axios.get('api/event');
    setEvents(response.data);
    // console.log(response);
  }

  const myEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title="myEvents" />
      <Grid spacing={0} container className="upcoming-event">
        {events.length > 0
          ? events
              .slice(0, 3)
              .map((event) => <EventCard event={event} key={event.slug} />)
          : [0, 1, 2].map((item, key) => (
              <Skeleton
                variant="rectangular"
                width={450}
                height={300}
                key={item}
                style={{ margin: 10, borderRadius: 10 }}
              />
            ))}
      </Grid>
    </Card>
  );

  const upcomingEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title="upcomingEvents" />
      <Grid spacing={0} container className="upcoming-event">
        {events.length > 0
          ? events.map((event) => <EventCard event={event} key={event.slug} />)
          : [0, 1, 2].map((item) => (
              <Skeleton
                variant="rectangular"
                width={450}
                height={300}
                key={item}
                style={{ margin: 10, borderRadius: 10 }}
              />
            ))}
      </Grid>
    </Card>
  );

  return (
    <>
      <div className="header">
        <img className="header-image" alt="" src={headerImageURL} />
        <div id="header-title">
          <text id="second-title">{t('home.welcomeTo')}</text>
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
      <div style={{ alignContent: 'center', display: 'flex' }}>
        <div className="container">
          {myEvents}
          {upcomingEvents}
        </div>
      </div>
    </>
  );
}

function SectionTitle(props: { title }): JSX.Element {
  const { t } = useTranslation('translation'); // translation module
  const { title } = props;
  return (
    <span className="section">
      <h1>{t(`home.${title}`)}</h1>
      <Button>{t('home.seeMore')}</Button>
    </span>
  );
}

export default Home;
