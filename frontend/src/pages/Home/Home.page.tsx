import { useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import { LastPostsSection } from './views/section/LastPostsSection';
import { PinnedPostsSection } from './views/section/PinnnedPostsSection';
import { UpcomingEventsSection } from './views/section/UpcomingEventsSection';

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
  // const { t } = useTranslation(); // translation module

  const openedPostId = parseInt(queryParams.get('post'));

  const queryClient = useQueryClient();

  // const { status: myGroupsStatus, data: myGroups } = useQuery<
  //   SimpleGroupProps[],
  //   LoadStatus
  // >({
  //   queryKey: 'myGroups',
  //   queryFn: getMyGroups,
  // });

  return (
    <>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <CreateNewButton
          onEventCreated={() => {
            queryClient.invalidateQueries('posts');
          }}
        />
        <PinnedPostsSection enabled={!openedPostId} />
        <LastPostsSection enabled={!openedPostId} />
        <UpcomingEventsSection enabled={!openedPostId} />
        {/* <ClubSection
          clubs={myGroups}
          status={myGroupsStatus}
          title={t('home.myClubs')}
        /> */}
        <Spacer vertical="48px" />
      </Container>
      {!!openedPostId && (
        <PostModal
          postId={openedPostId}
          onClose={() => {
            queryParams.delete('post');
            setQueryParams(queryParams);
          }}
        />
      )}
    </>
  );
}
