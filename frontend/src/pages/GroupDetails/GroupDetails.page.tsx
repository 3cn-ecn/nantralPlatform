import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { BackgroundImageOverlay } from '#pages/EventDetails/components/BackgroundImageOverlay';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { TopImage } from '#shared/components/TopImage/TopImage';

import { GroupAdminRequests } from './GroupAdminRequests/GroupAdminRequests.tab';
import { GroupEvents } from './GroupEvents/GroupEvents.tab';
import { GroupHome } from './GroupHome/GroupHome.tab';
import { GroupMembers } from './GroupMembers/GroupMembers.tab';
import { GroupPosts } from './GroupPosts/GroupPosts.tab';
import { GroupTabBar } from './GroupTabBar/GroupTabBar';
import { EditButton } from './components/Buttons/EditButton';
import { GroupInfo } from './components/GroupInfo';
import { useGroupDetails } from './hooks/useGroupDetails';

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
  } = useGroupDetails(slug?.slice(1));

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
          <EditButton group={groupDetails} />
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
        {isSuccess && groupDetails && (
          <GroupTabBar
            value={tabValue}
            group={groupDetails}
            onChangeValue={(val) => {
              setTabValue(val);
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
          <GroupEvents group={groupDetails} />
        )}
        {tabValue == 'posts' && groupDetails && (
          <GroupPosts group={groupDetails} />
        )}
        {tabValue == 'adminRequests' && groupDetails && (
          <GroupAdminRequests group={groupDetails} />
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
