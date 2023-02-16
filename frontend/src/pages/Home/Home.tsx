import {
  Button,
  Card,
  Grid,
  Skeleton,
  SvgIcon,
  Typography,
} from '@mui/material';
import { CalendarMonthTwoTone } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { EventProps } from 'Props/Event';
import { ClubProps } from 'Props/Club';
import React from 'react';
import Slider from 'react-slick';
import { NavLink } from 'react-router-dom';
import ClubAvatar from '../../components/ClubAvatar/ClubAvatar';
import EventCard from '../../components/EventCard/EventCard';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';
import { ButtonBanner } from '../../components/ButtonBanner/ButtonBanner';

const maxEventCount = 6;
const clubAvatarSize = 120;
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home(props) {
  const [events, setEvents] = React.useState<Array<EventProps>>(undefined);
  const [eventsStatus, setEventsStatus] = React.useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [myClubs, setMyClubs] = React.useState<Array<ClubProps>>(undefined);
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
        setEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventsStatus('error');
      });
  }
  async function getMyClubs() {
    axios
      .get('api/club/my-clubs')
      .then((res) => {
        setMyClubs(res.data);
      })
      .catch((err) => console.error(err));
  }

  const LoadingSkeleton = (
    <>
      {[0, 1, 2].map((item, key) => (
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
    </>
  );

  function isThisWeek(date: Date): boolean {
    const today: number = date.getTime();

    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    return today >= monday.getTime() && today <= sunday.getTime();
  }

  let myEventsContent;
  switch (eventsStatus) {
    case 'error':
      myEventsContent = null;
      break;
    case 'loading':
      myEventsContent = LoadingSkeleton;
      break;
    case 'success':
      if (events.filter((item) => isThisWeek(new Date(item.date))).length > 0) {
        myEventsContent = events
          .filter((item) => isThisWeek(new Date(item.date)))
          .slice(0, 3)
          .map((event) => <EventCard event={event} key={event.slug} />);
      } else {
        myEventsContent = <p>Aucun évènement actuellement</p>;
      }
      break;
    default:
      myEventsContent = null;
  }

  const myEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title="Cette Semaine" url="/event" />
      <Grid spacing={0} container className="upcoming-event">
        {myEventsContent}
      </Grid>
    </Card>
  );

  const upcomingEvents = (
    <Card variant="outlined" className="card">
      <SectionTitle title={t('home.upcomingEvents')} url="/event" />
      <Grid spacing={0} container className="upcoming-event">
        {events
          ? events
              .slice(0, maxEventCount)
              .map((event) => <EventCard event={event} key={event.slug} />)
          : LoadingSkeleton}
      </Grid>
    </Card>
  );
  const myClubsSection = (
    <Card variant="outlined" className="card">
      <SectionTitle title={t('home.myClubs')} url="/club" />
      <Grid container>
        {myClubs
          ? myClubs.map((item) => (
              <ClubAvatar
                name={item.name}
                clubUrl={item.get_absolute_url}
                logoUrl={item.logo_url}
                key={item.name}
                size={clubAvatarSize}
              />
            ))
          : [0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                variant="circular"
                height={clubAvatarSize}
                width={clubAvatarSize}
                sx={{ margin: '10px' }}
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
          <Typography id="second-title">{t('home.welcomeTo')}</Typography>
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
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
      </div>
      <div style={{ alignContent: 'center', display: 'flex', paddingTop: 20 }}>
        <div className="container">
          <ButtonBanner imageUri="https://scontent-cdg2-1.xx.fbcdn.net/v/t39.30808-6/331025535_6475709975779474_1538531856304866688_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=8631f5&_nc_ohc=9-rJrSTbmTAAX-ap3mM&_nc_ht=scontent-cdg2-1.xx&oh=00_AfAZrGMxaT31DRn7NkL1OE7iiK0qh8HqGl8pMEFLx871hg&oe=63F094FD" />
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
      <h1>{title}</h1>
      <NavLink to={url} className="see-more">
        <Button>{t('home.seeMore')}</Button>
      </NavLink>
    </span>
  );
}

export default Home;
