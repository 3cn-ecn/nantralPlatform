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
import { useQuery } from 'react-query';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps } from '../../Props/Event';
import './Home.scss';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps, convertPostFromPythonData } from '../../Props/Post';
import { LoadStatus } from '../../Props/GenericTypes';
import { FormPost } from '../../components/FormPost/FormPost';
import EditEventModal from '../../components/FormEvent/FormEvent';
import { PostModal } from '../../components/Modal/PostModal';
import { getMyGroups } from '../../api/group';
import { getEvents } from '../../api/event';
import { getPosts } from '../../api/post';

const MAX_EVENT_SHOWN = 6;
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  // Query Params
  const [queryParams, setQueryParams] = useSearchParams();
  // Dates
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const postDateLimit = new Date();
  postDateLimit.setDate(today.getDay() - 15);
  // Modals
  const [postFormOpen, setPostFormOpen] = React.useState<boolean>(false);
  const [eventFormOpen, setEventFormOpen] = React.useState<boolean>(false);
  const [selectedPost, setSelectedPost] = React.useState<PostProps>(null);
  const { t } = useTranslation('translation'); // translation module

  React.useEffect(() => {
    const postId = queryParams.get('post');
    if (postId) {
      axios
        .get(`/api/post/${postId}`)
        .then((res) => {
          convertPostFromPythonData(res.data);
          setSelectedPost(res.data);
        })
        .catch((err) => {
          console.error(err);
          queryParams.delete('post');
          setQueryParams(queryParams);
        });
    }
  }, [queryParams]);

  const { status: myGroupsStatus, data: myGroups } = useQuery<
    SimpleGroupProps[],
    LoadStatus
  >({
    queryKey: 'myGroups',
    queryFn: getMyGroups,
  });

  const {
    status: thisWeekEventsStatus,
    data: thisWeekEvents,
    refetch: refetchThisWeekEvents,
  } = useQuery<EventProps[]>({
    queryKey: 'thisWeekEvents',
    queryFn: () =>
      getEvents({ fromDate: today, toDate: nextWeek, orderBy: ['date'] }),
  });

  const {
    status: upcomingEventsStatus,
    data: upcomingEvents,
    refetch: refetchUpcomingEvents,
  } = useQuery<EventProps[]>({
    queryKey: 'upcomingEvents',
    queryFn: () =>
      getEvents({
        fromDate: nextWeek,
        orderBy: ['date'],
        limit: MAX_EVENT_SHOWN,
      }),
  });

  const {
    status: pinnedPostsStatus,
    data: pinnedPosts,
    refetch: refetchPinnedPosts,
  } = useQuery<PostProps[]>({
    queryKey: 'pinnedPosts',
    queryFn: () =>
      getPosts({
        pinned: true,
      }),
  });
  const {
    status: postsStatus,
    data: posts,
    refetch: refetchPosts,
  } = useQuery<PostProps[]>({
    queryKey: 'posts',
    queryFn: () =>
      getPosts({
        pinned: false,
        fromDate: postDateLimit,
      }),
  });

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
          {(pinnedPostsStatus === 'loading' || pinnedPosts.length > 0) && (
            <PostSection
              posts={pinnedPosts}
              title={t('home.highlighted')}
              status={pinnedPostsStatus}
              onUpdate={() => refetchPinnedPosts()}
            />
          )}
          <PostSection
            posts={posts}
            title={t('home.announcement')}
            status={postsStatus}
            onUpdate={() => refetchPosts()}
          />
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
            events={thisWeekEvents}
            status={thisWeekEventsStatus}
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
            clubs={myGroups}
            status={myGroupsStatus}
            title={t('home.myClubs')}
          />
        </Container>
      </Box>
      <FormPost
        open={postFormOpen}
        onClose={() => setPostFormOpen(false)}
        mode="create"
        onUpdate={() => {
          refetchPosts();
          refetchPinnedPosts();
        }}
      />
      <EditEventModal
        onUpdate={() => {
          refetchUpcomingEvents();
          refetchThisWeekEvents();
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
