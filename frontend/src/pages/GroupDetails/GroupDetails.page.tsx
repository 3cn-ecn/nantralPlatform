import { useParams } from 'react-router-dom';

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
import { GroupTabBar } from './GroupTabBar/GroupTabBar';
import { EditButton } from './components/Buttons/EditButton';
import { GroupInfo } from './components/GroupInfo';
import { useGroupDetails } from './hooks/useGroupDetails';

type TabTypes = 'home' | 'members' | 'events' | 'posts' | 'adminRequests';

export default function GroupDetailsPage() {
  const urlPathParams = useParams();
  const slug = (urlPathParams.type as string).slice(1);

  const [tabValue, setTabValue] = useQueryParamState<TabTypes>('tab', 'home');
  const { postId, closePost } = usePostQueryParamState();

  const {
    groupDetails,
    events,
    members,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess,
  } = useGroupDetails(slug);

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
        {groupDetails?.isAdmin && <EditButton group={groupDetails} />}
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
            onChangeValue={(val: TabTypes) => {
              setTabValue(val);
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
      {postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
