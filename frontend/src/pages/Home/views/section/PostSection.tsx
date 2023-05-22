import React, { useState } from 'react';

import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Alert, Button, Grid, Typography } from '@mui/material';

import { Post } from '#modules/post/post.types';
import {
  PostCard,
  PostCardSkeleton,
} from '#shared/components/PostCard/PostCard';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';
import { FormPostProps } from '#types/Post';

const DEFAULT_POST_NUMBER = 3;

type PostSectionProps = {
  posts: Array<Post>;
  isLoading: boolean;
  isError: boolean;
  onUpdate?: (post: FormPostProps) => void;
  pinnedOnly?: boolean;
};

export function PostSection({
  posts,
  isLoading,
  isError,
  onUpdate,
  pinnedOnly = false,
}: PostSectionProps) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const sectionTitle = pinnedOnly
    ? t('home.postSection.pinnedTitle')
    : t('home.postSection.title');

  if (isLoading) {
    return (
      <Section title={sectionTitle}>
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
    return (
      <Section title={sectionTitle}>
        <Alert severity="error" sx={{ width: 'max-content' }}>
          {t('home.postSection.error')}
        </Alert>
      </Section>
    );
  }

  if (posts.length === 0) {
    return (
      <Section title={sectionTitle}>
        <Typography>{t('home.postSection.isEmpty')}</Typography>
      </Section>
    );
  }

  const postsToShow = posts.slice(0, showAll ? undefined : DEFAULT_POST_NUMBER);

  return (
    <Section title={sectionTitle}>
      <Grid spacing={1} container>
        {postsToShow.map((post) => (
          <Grid key={post.id} xs={12} md={4} item>
            <PostCard
              post={post}
              onUpdate={onUpdate}
              onDelete={() => onUpdate(null)}
            />
          </Grid>
        ))}
      </Grid>
      {posts.length > DEFAULT_POST_NUMBER && (
        <Button
          onClick={() => setShowAll(!showAll)}
          endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          color="secondary"
          sx={{ mt: 1 }}
        >
          {showAll ? t('button.showLess') : t('button.showMore')}
        </Button>
      )}
    </Section>
  );
}
