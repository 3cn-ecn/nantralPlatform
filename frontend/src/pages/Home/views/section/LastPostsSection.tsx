import { Alert, Grid, Pagination, Typography } from '@mui/material';

import { PostCard } from '#modules/post/view/PostCard/PostCard';
import { PostCardSkeleton } from '#modules/post/view/PostCard/PostCardSkeleton';
import { useLastPostsQuery } from '#pages/Home/hooks/useLastPosts.query';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';
import { arrayRange } from '#shared/utils/arrayRange';

const NUMBER_OF_POSTS = 3;

interface LastPostsSectionProps {
  enabled: boolean;
}

export function LastPostsSection({ enabled }: LastPostsSectionProps) {
  const { t } = useTranslation();
  const { lastPosts, isLoading, isIdle, isError, numPages, page, setPage } =
    useLastPostsQuery(NUMBER_OF_POSTS, { enabled });

  if (isLoading || isIdle) {
    return (
      <Section title={t('home.postSection.title')}>
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
      <Section title={t('home.postSection.title')}>
        <Alert severity="error" sx={{ width: 'max-content' }}>
          {t('home.postSection.error')}
        </Alert>
      </Section>
    );
  }

  if (lastPosts.length === 0) {
    return (
      <Section title={t('home.postSection.title')}>
        <Typography>{t('home.postSection.isEmpty')}</Typography>
      </Section>
    );
  }

  return (
    <Section title={t('home.postSection.title')}>
      <Grid spacing={1} container>
        {lastPosts.map((post) => (
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
          sx={{ mt: 1 }}
        />
      )}
    </Section>
  );
}
