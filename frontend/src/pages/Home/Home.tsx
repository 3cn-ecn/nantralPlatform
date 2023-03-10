import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import * as React from 'react';
import { SvgIcon, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { isThisWeek } from '../../utils/date';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps, postsToCamelCase } from '../../Props/Post';
import { LoadStatus } from '../../Props/GenericTypes';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [eventsStatus, setEventsStatus] = React.useState<LoadStatus>('load');
  const [myClubs, setMyClubs] = React.useState<Array<ClubProps>>([]);
  const [clubsStatus, setClubsStatus] = React.useState<LoadStatus>('load');
  const [posts, setPosts] = React.useState<Array<PostProps>>([]);
  const [postsStatus, setPostsStatus] = React.useState<LoadStatus>('load');
  const { t } = useTranslation('translation'); // translation module
  const headerImageURL = '/static/img/central_background.jpg';
  React.useEffect(() => {
    // fetch events
    axios
      .get('/api/event/', {
        params: {
          from_date: new Date().toISOString(),
          order_by: 'begin_inscription',
        },
      })
      .then((res) => {
        eventsToCamelCase(res.data);
        setEvents(res.data);
        setEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventsStatus('fail');
      });
    // fetch my clubs
    axios
      .get('/api/group/group/', { params: { is_member: true, type: 'club' } })
      .then((res) => {
        setMyClubs(res.data.results);
        setClubsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setClubsStatus('fail');
      });
    // fetch posts
    axios
      .get('/api/post')
      .then((res) => {
        postsToCamelCase(res.data);
        setPosts(res.data);
        setPostsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsStatus('fail');
      });
  }, []);

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
              }}
            />
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
      </div>
      <div style={{ alignContent: 'center', display: 'flex', paddingTop: 20 }}>
        <Container>
          {posts.filter((post) => post.pinned) && (
            <PostSection
              posts={posts.filter((post) => post.pinned)}
              title={t('home.highlighted')}
              status={postsStatus}
            />
          )}
          {posts.filter((post) => !post.pinned) && (
            <PostSection
              posts={posts.filter((post) => !post.pinned)}
              title={t('home.announcement')}
              status={postsStatus}
            />
          )}
          <EventSection
            events={events.filter((item: EventProps) =>
              isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            seeMoreUrl="/event"
            title={t('home.thisWeek')}
            accordion
          />
          <EventSection
            events={events.filter(
              (item: EventProps) => !isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            maxItem={6}
            seeMoreUrl="/event"
            title={t('home.upcomingEvents')}
            accordion
          />
          <ClubSection
            clubs={myClubs}
            status={clubsStatus}
            title={t('home.myClubs')}
            seeMoreUrl="/club"
            accordion
          />
        </Container>
      </div>
    </>
  );
}

export default Home;
