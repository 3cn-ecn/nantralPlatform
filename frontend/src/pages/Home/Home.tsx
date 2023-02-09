import { Button, Card, Grid, Skeleton, SvgIcon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { EventProps } from 'pages/Props/Event';
import { ClubProps } from 'pages/Props/Club';
import React from 'react';
import ClubAvatar from '../../components/ClubAvatar/ClubAvatar';
import EventCard from '../../components/EventCard/EventCard';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home(props) {
  console.log(props);
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [myClubs, setMyClubs] = React.useState<Array<ClubProps>>([]);
  const { t } = useTranslation('translation'); // translation module
  const headerImageURL =
    'https://www.ec-nantes.fr/medias/photo/carroussel-campus-drone-002_1524738012430-jpg';
  React.useEffect(() => {
    getEvent();
    getMyClubs();
  }, []);

  async function getEvent() {
    axios
      .get('api/event')
      .then((res) => {
        setEvents(res.data);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }
  async function getMyClubs() {
    axios
      .get('api/club/my-clubs')
      .then((res) => {
        setMyClubs(res.data);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }

  const myEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title="myEvents" url="/event" />
      <Grid spacing={0} container className="upcoming-event">
        {events.length > 0
          ? events
              .slice(0, 3)
              .map((event) => <EventCard event={event} key={event.slug} />)
          : [0, 1, 2].map((item, key) => (
              <Skeleton
                variant="rectangular"
                width={Math.min(
                  (Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                  ) *
                    2) /
                    3,
                  450
                )}
                height={Math.min(
                  Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                  ) / 2,
                  300
                )}
                key={item}
                style={{ margin: 10, borderRadius: 10 }}
              />
            ))}
      </Grid>
    </Card>
  );

  const upcomingEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title="upcomingEvents" url="/event" />
      <Grid spacing={0} container className="upcoming-event">
        {events.length > 0
          ? events.map((event) => <EventCard event={event} key={event.slug} />)
          : [0, 1, 2].map((item) => (
              <Skeleton
                variant="rectangular"
                width={Math.min(
                  (Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                  ) *
                    2) /
                    3,
                  450
                )}
                height={Math.min(
                  Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                  ) / 2,
                  300
                )}
                key={item}
                style={{ margin: 10, borderRadius: 10 }}
              />
            ))}
      </Grid>
    </Card>
  );
  const myClubsSection = (
    <Card variant="outlined" className="card">
      <SectionTitle title="myClubs" url="/club" />
      <Grid container>
        {myClubs.map((item) => (
          <ClubAvatar
            name={item.name}
            clubUrl={item.get_absolute_url}
            logoUrl={item.logo_url}
            key={item.name}
            size={120}
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
              sx={{
                height: 50,
                width: 50,
                display: { xs: 'none', md: 'flex' },
              }}
            />
            <p id="main-title">Nantral Platform</p>
          </div>
        </div>
      </div>
      <div style={{ alignContent: 'center', display: 'flex' }}>
        <div className="container">
          {myEvents}
          {upcomingEvents}
          {myClubsSection}
        </div>
      </div>
    </>
  );
}

function SectionTitle(props: { title: string; url: string }): JSX.Element {
  const { t } = useTranslation('translation'); // translation module
  const { title, url } = props;
  return (
    <span className="section">
      <h1>{t(`home.${title}`)}</h1>
      <Button onClick={() => window.open(url, '_self')}>
        {t('home.seeMore')}
      </Button>
    </span>
  );
}

export default Home;
