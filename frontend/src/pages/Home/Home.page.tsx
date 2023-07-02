import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';

import { Box, Chip, Container, Divider, Typography } from '@mui/material';
import axios from 'axios';

import { getMyGroups } from '#api/group';
import { getEvents } from '#modules/event/api/getEventList';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { useTranslation } from '#shared/i18n/useTranslation';
import { LoadStatus } from '#types/GenericTypes';
import { SimpleGroupProps } from '#types/Group';
import { PostProps, convertPostFromPythonData } from '#types/Post';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import { EventSection } from './views/section/EventSection';
import { LastPostSection } from './views/section/LastPostSection';
import { PinnedPostSection } from './views/section/PinnnedPostSection';

const MAX_EVENT_SHOWN = 6;

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function HomePage() {
  // Query Params
  const [queryParams, setQueryParams] = useSearchParams();
  // Dates
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  // Modals
  const [selectedPost, setSelectedPost] = useState<PostProps>(null);
  const { t } = useTranslation(); // translation module

  const queryClient = useQueryClient();

  useEffect(() => {
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
  } = useQuery({
    queryKey: 'thisWeekEvents',
    queryFn: () =>
      getEvents({ fromDate: today, toDate: nextWeek, orderBy: ['date'] }),
  });

  const {
    status: upcomingEventsStatus,
    data: upcomingEvents,
    refetch: refetchUpcomingEvents,
  } = useQuery({
    queryKey: 'upcomingEvents',
    queryFn: () =>
      getEvents({
        fromDate: nextWeek,
        orderBy: ['date'],
        limit: MAX_EVENT_SHOWN,
      }),
  });

  return (
    <>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <CreateNewButton
          onEventCreated={() => {
            queryClient.invalidateQueries('posts');
          }}
          onPostCreated={() => {
            queryClient.invalidateQueries('events');
          }}
        />
        <PinnedPostSection />
        <LastPostSection />
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
        {/* <ClubSection
          clubs={myGroups}
          status={myGroupsStatus}
          title={t('home.myClubs')}
        /> */}
      </Container>
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