import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SimpleGroupProps } from 'Props/Group';
import * as React from 'react';
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
  Container,
  Chip,
  Divider,
} from '@mui/material';
import { Event, PostAdd } from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import './Home.scss';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { isThisWeek } from '../../utils/date';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps, postsToCamelCase } from '../../Props/Post';
import { ListResults, LoadStatus } from '../../Props/GenericTypes';
import { FormPost } from '../../components/FormPost/FormPost';
import EditEventModal from '../../components/FormEvent/FormEvent';
import { PostModal } from '../../components/Modal/PostModal';

const MAX_EVENT_SHOWN = 6;
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [queryParams, setQueryParams] = useSearchParams();
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [eventsStatus, setEventsStatus] = React.useState<LoadStatus>('load');
  const [upcomingEvents, setUpcomingEvents] = React.useState<Array<EventProps>>(
    []
  );
  const [upcomingEventsStatus, setUpcomingEventsStatus] =
    React.useState<LoadStatus>('load');
  const [myClubs, setMyClubs] = React.useState<Array<SimpleGroupProps>>([]);
  const [clubsStatus, setClubsStatus] = React.useState<LoadStatus>('load');
  const [posts, setPosts] = React.useState<Array<PostProps>>([]);
  const [postsStatus, setPostsStatus] = React.useState<LoadStatus>('load');
  const [postsPinned, setPostsPinned] = React.useState<Array<PostProps>>([]);
  const [postsPinnedStatus, setPostsPinnedStatus] =
    React.useState<LoadStatus>('load');

  const [postFormOpen, setPostFormOpen] = React.useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = React.useState<boolean>(false);
  const [selectedPost, setSelectedPost] = React.useState<PostProps>(null);
  const { t } = useTranslation('translation'); // translation module
  const today = new Date();
  const postDateLimit = new Date();
  postDateLimit.setDate(today.getDay() - 15);
  React.useEffect(() => {
    const postId = queryParams.get('post');
    if (postId) {
      axios
        .get(`/api/post/${postId}`)
        .then((res) => {
          postsToCamelCase([res.data]);
          setSelectedPost(res.data);
        })
        .catch((err) => {
          console.error(err);
          queryParams.delete('post');
          setQueryParams(queryParams);
        });
    }
    getEvents();
    getUpcomingEvent();
    getMyClubs();
    getPosts();
    getPinnedPosts();
  }, []);

  React.useEffect(() => {
    const postId = queryParams.get('post');
    if (postId) {
      axios
        .get(`/api/post/${postId}`)
        .then((res) => {
          postsToCamelCase([res.data]);
          setSelectedPost(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [queryParams]);

  async function getEvents() {
    // fetch events
    const prevEvent = JSON.parse(localStorage.getItem('pastEvents'));
    if (prevEvent) {
      setEventsStatus('success');
      setEvents(prevEvent);
    }
    axios
      .get('/api/event/', {
        params: {
          from_date: new Date().toISOString(),
          time_field: 'end_date',
          order_by: 'date',
        },
      })
      .then((res) => {
        const results: ListResults<EventProps> = res.data;
        eventsToCamelCase(results.results);
        setEvents(results.results);
        localStorage.setItem('pastEvents', JSON.stringify(results.results));
        setEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventsStatus('fail');
      });
  }

  async function getUpcomingEvent() {
    const prev = JSON.parse(localStorage.getItem('upcomingEvents'));
    if (prev) {
      setUpcomingEventsStatus('success');
      eventsToCamelCase(prev);
      setUpcomingEvents(prev);
    }
    const date = new Date();
    date.setDate(date.getDate() + 7);
    axios
      .get('/api/event/', {
        params: {
          from_date: date.toISOString(),
          order_by: 'date',
          time_field: 'date',
          limit: MAX_EVENT_SHOWN,
        },
      })
      .then((res) => {
        const results: ListResults<EventProps> = res.data;
        eventsToCamelCase(results.results);
        setUpcomingEvents(results.results);
        localStorage.setItem('upcomingEvents', JSON.stringify(results.results));
        setUpcomingEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setUpcomingEventsStatus('fail');
      });
  }

  async function getMyClubs() {
    // fetch my clubs
    const prev = JSON.parse(localStorage.getItem('myClubs'));
    if (prev) {
      setClubsStatus('success');
      setMyClubs(prev);
    }
    axios
      .get('/api/group/group/', { params: { is_member: true, simple: true } })
      .then((res) => {
        const results: ListResults<SimpleGroupProps> = res.data;
        setMyClubs(results.results);
        localStorage.setItem('myClubs', JSON.stringify(results.results));
        setClubsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setClubsStatus('fail');
      });
  }

  async function getPosts() {
    // fetch posts
    const prev = JSON.parse(localStorage.getItem('posts'));
    if (prev) {
      setPostsStatus('success');
      postsToCamelCase(prev);
      setPosts(prev);
    }
    axios
      .get('/api/post/', {
        params: {
          from_date: postDateLimit.toISOString(),
          pinned: false,
        },
      })
      .then((res) => {
        postsToCamelCase(res.data);
        setPosts(res.data);
        localStorage.setItem('posts', JSON.stringify(res.data));
        setPostsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsStatus('fail');
      });
  }

  async function getPinnedPosts() {
    // fetch posts
    const prev = JSON.parse(localStorage.getItem('pinnedPosts'));
    if (prev) {
      setPostsPinnedStatus('success');
      postsToCamelCase(prev);
      setPostsPinned(prev);
    }
    axios
      .get('/api/post/', {
        params: {
          pinned: true,
        },
      })
      .then((res) => {
        postsToCamelCase(res.data);
        setPostsPinned(res.data);
        localStorage.setItem('pinnedPosts', JSON.stringify(res.data));
        setPostsPinnedStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsPinnedStatus('fail');
      });
  }

  const actions = [
    {
      icon: <Event />,
      name: t('event.event'),
      onClick: () => setEventFormOpen(true),
    },
    {
      icon: <PostAdd />,
      name: t('post.post'),
      onClick: () => setPostFormOpen(true),
    },
  ];

  return (
    <>
      <div className="header">
        <div id="header-title">
          <Typography id="second-title">{t('home.welcomeTo')}</Typography>
          <div id="title">
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
        <div className="header-image-container">
          <img className="header-image" alt="" src="/static/img/header.png" />
        </div>
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
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{ position: 'fixed', bottom: 24, right: 24, flexGrow: 1 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              onClick={action.onClick}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
            />
          ))}
        </SpeedDial>
        <Container sx={{ marginBottom: 3 }}>
          {(postsPinnedStatus === 'load' || postsPinned.length > 0) && (
            <PostSection
              posts={postsPinned}
              title={t('home.highlighted')}
              status={postsPinnedStatus}
              onUpdate={() => getPinnedPosts()}
            />
          )}
          {posts.filter((post) => !post.pinned) && (
            <PostSection
              posts={posts.filter((post) => !post.pinned)}
              title={t('home.announcement')}
              status={postsStatus}
              onUpdate={() => getPosts()}
            />
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={1}
          >
            <Typography variant="h4" margin={0}>
              {t('navbar.events')}
            </Typography>
            <Link to="/event" style={{ textDecorationLine: 'none' }}>
              <Chip label={t('button.seeAll')} clickable />
            </Link>
          </Box>
          <Divider sx={{ marginBottom: 1 }} />
          <EventSection
            events={events.filter((item: EventProps) =>
              isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            title={t('home.thisWeek')}
          />
          <EventSection
            events={upcomingEvents}
            status={upcomingEventsStatus}
            maxItem={6}
            loadingItemCount={MAX_EVENT_SHOWN}
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
      <EditEventModal
        onUpdate={() => {
          getUpcomingEvent();
          getEvents();
        }}
        open={eventFormOpen}
        closeModal={() => setEventFormOpen(false)}
      />
      {selectedPost && (
        <PostModal
          onClose={() => {
            setSelectedPost(null);
            queryParams.delete('post');
            setQueryParams(queryParams);
          }}
          open={!!selectedPost}
          post={selectedPost}
        />
      )}
    </>
  );
}

export default Home;
