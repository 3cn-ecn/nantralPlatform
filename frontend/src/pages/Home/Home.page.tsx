import { Container } from '@mui/material';

import { usePostQueryParamState } from '#modules/post/hooks/usePostQueryParamState';
import { PostModal } from '#modules/post/view/PostModal/PostModal';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { CreateNewButton } from './views/CreateNewButton';
import { HomeHeader } from './views/HomeHeader';
import Shortcuts from './views/Shortcuts';
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
  const { postId, closePost } = usePostQueryParamState();
  // Dates
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return (
    <>
      <HomeHeader />
      <Container sx={{ my: 4 }}>
        <Shortcuts />
        <CreateNewButton />
        <PinnedPostsSection enabled={!postId} />
        <UpcomingEventsSection enabled={!postId} />
        <LastPostsSection enabled={!postId} />
        <MyGroupsSection />
        <Spacer vertical={3} />
        <HelpUsSection />
        <Spacer vertical={6} />
      </Container>
      {!!postId && <PostModal postId={postId} onClose={closePost} />}
    </>
  );
}
