import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { BackgroundImageOverlay } from '#pages/EventDetails/components/BackgroundImageOverlay';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { TopImage } from '#shared/components/TopImage/TopImage';

import { GroupEvents } from './GroupEvents/GroupEvents.tab';
import { GroupHome } from './GroupHome/GroupHome.tab';
import { GroupMembers } from './GroupMembers/GroupMembers.tab';
import { GroupPosts } from './GroupPosts/GroupPosts.tab';
import { GroupTabBar } from './GroupTabBar/GroupTabBar';
import { useGroupDetails } from './hooks/useGroupDetails';
import { EditButton } from './shared/Buttons/EditButton';
import { GroupInfo } from './shared/GroupInfo';

export default function GroupDetailsPage() {
  const { type: slug } = useParams();

  const [params, setParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(params.get('tab') || 'home');
  const {
    groupDetails,
    events,
    members,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useGroupDetails(slug?.replace('@', ''));

  if (isError && error) {
    return (
      <ErrorPageContent
        status={error.status}
        errorMessage={error.message}
        retryFn={refetch}
      />
    );
  }

  const postId = params.get('post');

  return (
    <>
      {groupDetails?.banner && (
        <BackgroundImageOverlay src={groupDetails.banner} />
      )}
      <Container sx={{ mb: 2 }}>
        {groupDetails?.isAdmin && members && (
          <EditButton group={groupDetails} members={members?.results} />
        )}
        {groupDetails?.banner && (
          <TopImage src={groupDetails.banner} aspectRatio={110 / 40} />
        )}
        <GroupInfo
          eventCount={events?.count}
          memberCount={members?.count}
          group={groupDetails}
          isLoading={isLoading}
        />
        {isSuccess && (
          <GroupTabBar
            value={tabValue}
            onChangeValue={(val) => {
              setTabValue(val);
              console.log(history.state);
              const url = new URL(window.location.toString());
              url.searchParams.set('tab', val);
              history.replaceState(history.state, '', url);
            }}
          />
        )}
        <Spacer vertical={2} />
        {tabValue == 'home' && <GroupHome group={groupDetails} />}
        {tabValue == 'members' && groupDetails && (
          <GroupMembers group={groupDetails} />
        )}
        {tabValue == 'events' && groupDetails && (
          <GroupEvents groupSlug={groupDetails?.slug} />
        )}
        {tabValue == 'posts' && groupDetails?.slug && (
          <GroupPosts groupSlug={groupDetails?.slug} />
        )}
        <Spacer vertical={80} />
      </Container>
      {postId && (
        <PostModal
          postId={Number.parseInt(postId)}
          onClose={() => {
            params.delete('post');
            setParams(params);
          }}
        />
      )}
    </>
  );
}
