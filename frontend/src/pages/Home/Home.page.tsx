import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';

import { Box, Chip, Container, Divider, Typography } from '@mui/material';
import axios from 'axios';

import { getMyGroups } from '#api/group';
import { getPosts } from '#api/post';
import { getEvents } from '#modules/event/api/getEventList';
import { PostModal } from '#shared/components/Modal/PostModal';
import { useTranslation } from '#shared/i18n/useTranslation';
import { LoadStatus } from '#types/GenericTypes';
import { SimpleGroupProps } from '#types/Group';
import {
  FormPostProps,
  PostProps,
  convertPostFromPythonData,
} from '#types/Post';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import { ClubSection } from './views/section/ClubSection';
import { EventSection } from './views/section/EventSection';
import { PostSection } from './views/section/PostSection';

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
  const postDateLimit = new Date();
  postDateLimit.setDate(today.getDay() - 15);
  // Modals
  const [selectedPost, setSelectedPost] = useState<PostProps>(null);
  const { t } = useTranslation(); // translation module

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

  return (
    <>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <CreateNewButton
          onEventCreated={() => {
            refetchPosts();
            refetchPinnedPosts();
          }}
          onPostCreated={() => {
            refetchUpcomingEvents();
            refetchThisWeekEvents();
          }}
        />
        {(pinnedPostsStatus === 'loading' || pinnedPosts.length > 0) && (
          <PostSection
            posts={pinnedPosts}
            title={t('home.highlighted')}
            status={pinnedPostsStatus}
            onUpdate={(newPost: FormPostProps) => {
              refetchPinnedPosts();
              if (!newPost.pinned) refetchPosts();
            }}
          />
        )}
        <PostSection
          posts={posts}
          title={t('home.announcement')}
          status={postsStatus}
          onUpdate={(newPost: FormPostProps) => {
            refetchPosts();
            if (newPost.pinned) refetchPinnedPosts();
          }}
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
