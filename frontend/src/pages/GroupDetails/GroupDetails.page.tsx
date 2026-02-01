import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { BackgroundImageOverlay } from '#pages/EventDetails/components/BackgroundImageOverlay';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { TopImage } from '#shared/components/TopImage/TopImage';
import { useQueryParamState } from '#shared/hooks/useQueryParamState';

import { GroupAdminRequests } from './GroupAdminRequests/GroupAdminRequests.tab';
import { GroupEvents } from './GroupEvents/GroupEvents.tab';
import { GroupHome } from './GroupHome/GroupHome.tab';
import { GroupMembers } from './GroupMembers/GroupMembers.tab';
import { GroupPosts } from './GroupPosts/GroupPosts.tab';
import { GroupTabBar, TabType } from './GroupTabBar/GroupTabBar';
import { GroupInfo } from './components/GroupInfo';
import { useGroupDetails } from './hooks/useGroupDetails';

export default function GroupDetailsPage() {
  const urlPathParams = useParams();
  const slug = (urlPathParams.type as string).slice(1);

  const [queryParams] = useSearchParams();
  const version = useMemo(() => {
    const paramVersion = queryParams.get('version');
    return paramVersion ? parseInt(paramVersion) : undefined;
  }, [queryParams]);

  const [selectedTab, setSelectedTab] = useQueryParamState<TabType>(
    'tab',
    'home',
  );
  const { postId, closePost } = usePostQueryParamState();

  const {
    groupDetails,
    events,
    members,
    isPending,
    isError,
    error,
    refetch,
    isSuccess,
  } = useGroupDetails(slug, version);

  if (isError && error) {
    return (
      <ErrorPageContent
        status={error.status}
        errorMessage={error.message}
        retryFn={refetch}
      />
    );
  }

  return (
    <>
      {groupDetails?.banner && (
        <BackgroundImageOverlay src={groupDetails.banner} />
      )}
      <Container sx={{ mb: 2 }}>
        {groupDetails?.banner && (
          <TopImage src={groupDetails.banner} aspectRatio={3} />
        )}
        <GroupInfo
          eventCount={events?.count}
          memberCount={members?.count}
          group={groupDetails}
          isPending={isPending}
        />
        {isSuccess && groupDetails && (
          <GroupTabBar
            value={selectedTab}
            group={groupDetails}
            onChangeValue={(val: TabType) => {
              setSelectedTab(val);
            }}
          />
        )}
        <Spacer vertical={2} />
        {selectedTab == 'home' && <GroupHome group={groupDetails} />}
        {selectedTab == 'members' && groupDetails && (
          <GroupMembers group={groupDetails} />
        )}
        {selectedTab == 'events' && groupDetails && (
          <GroupEvents group={groupDetails} />
        )}
        {selectedTab == 'posts' && groupDetails && (
          <GroupPosts group={groupDetails} />
        )}
        {selectedTab == 'adminRequests' && groupDetails && (
          <GroupAdminRequests group={groupDetails} />
        )}
        <Spacer vertical={80} />
      </Container>
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
