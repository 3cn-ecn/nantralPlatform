import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ClubProps } from 'Props/Group';
import * as React from 'react';
import { Box, Fab, SvgIcon, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { Add } from '@mui/icons-material';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { isThisWeek } from '../../utils/date';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps, postsToCamelCase } from '../../Props/Post';
import { LoadStatus } from '../../Props/GenericTypes';
import { FormPost } from '../../components/FormPost/FormPost';

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
  const [postsPinned, setPostsPinned] = React.useState<Array<PostProps>>([]);
  const [postsPinnedStatus, setPostsPinnedStatus] =
    React.useState<LoadStatus>('load');

  const [postFormOpen, setPostFormOpen] = React.useState<boolean>(false);
  const { t } = useTranslation('translation'); // translation module
  const today = new Date();
  const postDateLimit = new Date();
  postDateLimit.setDate(today.getDay() - 15);
  React.useEffect(() => {
    getEvent();
    getMyClubs();
    getPosts();
    getPinnedPosts();
  }, []);

  async function getEvent() {
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
  }

  async function getMyClubs() {
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
  }

  async function getPosts() {
    // fetch posts
    axios
      .get('/api/post', {
        params: {
          from_date: postDateLimit.toISOString(),
          pinned: false,
        },
      })
      .then((res) => {
        postsToCamelCase(res.data);
        setPosts(res.data);
        setPostsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsStatus('fail');
      });
  }

  async function getPinnedPosts() {
    // fetch posts
    axios
      .get('/api/post', {
        params: {
          pinned: true,
        },
      })
      .then((res) => {
        postsToCamelCase(res.data);
        setPostsPinned(res.data);
        setPostsPinnedStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsPinnedStatus('fail');
      });
  }

  return (
    <>
      <div className="header">
        <div id="header-title">
          <Typography id="second-title">{t('home.welcomeTo')}</Typography>
          <div id="title">
            <SvgIcon
              component={NantralIcon}
              inheritViewBox
              id="header-logo"
              sx={{
                height: 50,
                width: 50,
              }}
            />
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
        <img
          className="header-image"
          alt=""
          src="/static/img/central_background.jpg"
        />
      </div>
      <Box
        bgcolor="background.default"
        id="home-container"
        style={{
          alignContent: 'center',
          display: 'flex',
          paddingTop: 20,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setPostFormOpen(true)}
          sx={{ bottom: 0, right: 0, position: 'fixed', margin: 4 }}
        >
          <Add />
        </Fab>
        <Container sx={{ marginBottom: 3 }}>
          {(postsPinnedStatus === 'load' || postsPinned.length > 0) && (
            <PostSection
              posts={postsPinned}
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
            title={t('home.thisWeek')}
          />
          <EventSection
            events={events.filter(
              (item: EventProps) => !isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            maxItem={6}
            title={t('home.upcomingEvents')}
          />
          <ClubSection
            clubs={myClubs}
            status={clubsStatus}
            title={t('home.myClubs')}
          />
        </Container>
      </Box>
      <FormPost
        open={postFormOpen}
        onClose={() => setPostFormOpen(false)}
        mode="create"
        onUpdate={() => {
          getPosts();
          getPinnedPosts();
        }}
      />
    </>
  );
}

export default Home;
