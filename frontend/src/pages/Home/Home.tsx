import { Card, Grid, Skeleton, SvgIcon, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { EventProps } from 'Props/Event';
import { ClubProps } from 'Props/Club';
import React from 'react';
import ClubAvatar from '../../components/ClubAvatar/ClubAvatar';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';
import { ButtonBanner } from '../../components/ButtonBanner/ButtonBanner';
import {
  EventSection,
  SectionTitle,
} from '../../components/EventSection/EventSection';

const clubAvatarSize = 120;
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [eventsStatus, setEventsStatus] = React.useState<
    'loading' | 'success' | 'error'
  >('loading');
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
        setEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventsStatus('error');
      });
  }
  async function getMyClubs() {
    axios
      .get('/api/group/group/', { params: { is_member: true, type: 'club' } })
      .then((res) => {
        setMyClubs(res.data);
      })
      .catch((err) => console.error(err));
  }

  function isThisWeek(date: Date): boolean {
    const todayTime: number = date.getTime();
    const monday = new Date();
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay() + 8);
    return todayTime >= monday.getTime() && todayTime <= sunday.getTime();
  }

  const myClubsSection = (
    <Card variant="outlined" className="card">
      <SectionTitle title={t('home.myClubs')} url="/club" />
      <Grid container>
        {myClubs
          ? myClubs.map((item) => (
              <ClubAvatar
                name={item.name}
                clubUrl={item.url}
                logoUrl={item.icon}
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
                // display: { xs: 'none', md: 'flex' },
              }}
            />
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
      </div>
      <div style={{ alignContent: 'center', display: 'flex', paddingTop: 20 }}>
        <div className="container">
          <ButtonBanner imageUri="https://scontent-cdg2-1.xx.fbcdn.net/v/t39.30808-6/331025535_6475709975779474_1538531856304866688_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=8631f5&_nc_ohc=9-rJrSTbmTAAX-ap3mM&_nc_ht=scontent-cdg2-1.xx&oh=00_AfAZrGMxaT31DRn7NkL1OE7iiK0qh8HqGl8pMEFLx871hg&oe=63F094FD" />
          <EventSection
            events={events.filter((item: EventProps) =>
              isThisWeek(new Date(item.date))
            )}
            status={eventsStatus}
            seeMoreUrl="/event"
            title={t('home.thisWeek')}
          />
          <EventSection
            events={events.filter(
              (item: EventProps) => !isThisWeek(new Date(item.date))
            )}
            status={eventsStatus}
            maxItem={3}
            seeMoreUrl="/event"
            title={t('home.upcomingEvents')}
          />
          {myClubsSection}
        </div>
      </div>
    </>
  );
}

export default Home;
