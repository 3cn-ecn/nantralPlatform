import { useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import { HelpUsSection } from './views/section/HelpUsSection';
import { LastPostsSection } from './views/section/LastPostsSection';
import { PinnedPostsSection } from './views/section/PinnnedPostsSection';
import { UpcomingEventsSection } from './views/section/UpcomingEventsSection';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export function HomePage() {
  // Query Params
  const [queryParams, setQueryParams] = useSearchParams();
  // Dates
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  // Modals
  // const { t } = useTranslation(); // translation module

  const openedPostId = queryParams.get('post');

  // const { status: myGroupsStatus, data: myGroups } = useQuery<
  //   SimpleGroupProps[],
  //   LoadStatus
  // >({
  //   queryKey: 'myGroups',
  //   queryFn: getMyGroups,
  // });

  return (
    <PageTemplate>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <CreateNewButton />
        <PinnedPostsSection enabled={!openedPostId} />
        <LastPostsSection enabled={!openedPostId} />
        <UpcomingEventsSection enabled={!openedPostId} />
        {/* <ClubSection
          clubs={myGroups}
          status={myGroupsStatus}
          title={t('home.myClubs')}
        /> */}
        <Spacer vertical={3} />
        <HelpUsSection />
        <Spacer vertical={6} />
      </Container>
      {!!openedPostId && (
        <PostModal
          postId={parseInt(openedPostId)}
          onClose={() => {
            queryParams.delete('post');
            setQueryParams(queryParams);
          }}
        />
      )}
    </PageTemplate>
  );
}
