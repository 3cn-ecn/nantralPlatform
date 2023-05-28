import React from 'react';

import { Alert, Grid, Pagination, Typography } from '@mui/material';

import {
  PostCard,
  PostCardSkeleton,
} from '#modules/post/view/PostCard/PostCard';
import { useLastPostsQuery } from '#pages/Home/hooks/useLastPosts.query';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';

export function LastPostSection() {
  const { t } = useTranslation();
  const { lastPosts, isLoading, isError, numPages, page, setPage } =
    useLastPostsQuery();

  if (isLoading) {
    return (
      <Section title={t('home.postSection.title')}>
        <Grid container spacing={1}>
          {[0, 1, 2].map((item) => (
            <Grid key={item} xs={12} md={4} item>
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
          <Grid key={post.id} xs={12} md={4} item>
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
