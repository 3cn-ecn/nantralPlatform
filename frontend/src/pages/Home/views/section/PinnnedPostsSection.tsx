import { Alert, Grid, Pagination } from '@mui/material';

import { PostCard } from '#modules/post/view/PostCard/PostCard';
import { PostCardSkeleton } from '#modules/post/view/PostCard/PostCardSkeleton';
import { usePinnedPostsQuery } from '#pages/Home/hooks/usePinnedPosts.query';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';
import { arrayRange } from '#shared/utils/arrayRange';

const NUMBER_OF_POSTS = 3;

interface PinnedPostsSectionProps {
  enabled: boolean;
}

export function PinnedPostsSection({
  enabled = true,
}: PinnedPostsSectionProps) {
  const { t } = useTranslation();
  const { pinnedPosts, isLoading, isIdle, isError, numPages, page, setPage } =
    usePinnedPostsQuery(NUMBER_OF_POSTS, { enabled });

  if (isLoading || isIdle) {
    return (
      <Section title={t('home.postSection.pinnedTitle')}>
        <Grid container spacing={1}>
          {arrayRange(NUMBER_OF_POSTS).map((_, index) => (
            <Grid key={index} xs={12} sm={6} md={4} item>
              <PostCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Section>
    );
  }

  if (isError) {
    if (page > 1) setPage(1);
    return (
      <Section title={t('home.postSection.pinnedTitle')}>
        <Alert severity="error" sx={{ width: 'max-content' }}>
          {t('home.postSection.error')}
        </Alert>
      </Section>
    );
  }

  if (pinnedPosts.length === 0) {
    return null;
  }

  return (
    <Section title={t('home.postSection.pinnedTitle')}>
      <Grid spacing={1} container>
        {pinnedPosts.map((post) => (
          <Grid key={post.id} xs={12} sm={6} md={4} item>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
      {numPages > 1 && (
        <Pagination
          count={numPages}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      )}
    </Section>
  );
}
