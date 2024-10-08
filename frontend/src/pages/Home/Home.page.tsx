import { useNavigate, useSearchParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import { HelpUsSection } from './views/section/HelpUsSection';
import { LastPostsSection } from './views/section/LastPostsSection';
import { MyGroupsSection } from './views/section/MyGroupsSection';
import { PinnedPostsSection } from './views/section/PinnnedPostsSection';
import { UpcomingEventsSection } from './views/section/UpcomingEventsSection';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function HomePage() {
  // Query Params
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  // Dates
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const openedPostId = queryParams.get('post');

  return (
    <>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <CreateNewButton />
        <PinnedPostsSection enabled={!openedPostId} />
        <UpcomingEventsSection enabled={!openedPostId} />
        <LastPostsSection enabled={!openedPostId} />
        <MyGroupsSection />
        <Spacer vertical={3} />
        <HelpUsSection />
        <Spacer vertical={6} />
      </Container>
      {!!openedPostId && (
        <PostModal
          postId={parseInt(openedPostId)}
          onClose={() => navigate({}, { preventScrollReset: true })}
        />
      )}
    </>
  );
}
