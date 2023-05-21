import React from 'react';

import { Box, Button, Divider, Grid, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';
import { LoadStatus } from '#types/GenericTypes';
import { FormPostProps, PostProps } from '#types/Post';

import { PostCard, PostCardSkeleton } from '../../PostCard/PostCard';

/**
 * Une section comportant
 * un titre,
 * un bouton __voir plus__ qui redirige vers une autre page du site,
 * et les événements de `events`
 */
export function PostSection(props: {
  status: LoadStatus;
  /** La liste des posts à afficher */
  posts: Array<PostProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'éléments à afficher */
  maxItem?: number;
  /** Nombre d'item à afficher de base */
  shownItem?: number;
  onUpdate?: (post: null | FormPostProps) => void;
}) {
  const { posts, title, maxItem, status, shownItem, onUpdate } = props;
  const allPosts = maxItem && posts ? posts.slice(0, maxItem) : posts;
  const { t } = useTranslation();
  const [showAll, setShowAll] = React.useState<boolean>(false);
  let content;
  switch (status) {
    case 'error':
      content = <p>Error</p>;
      break;
    case 'loading':
      content = [0, 1, 2].map((item) => (
        <Grid key={item} xs={12} md={4} item>
          <PostCardSkeleton />
        </Grid>
      ));
      break;
    case 'success':
      if (posts && allPosts?.length > 0)
        content = allPosts
          .slice(0, showAll ? allPosts.length : shownItem)
          .map((post) => (
            <Grid key={post.id} xs={12} md={4} item>
              <PostCard
                post={post}
                onUpdate={onUpdate}
                onDelete={() => onUpdate(null)}
              />
            </Grid>
          ));
      else
        content = (
          <Typography sx={{ marginLeft: 3, fontSize: 18 }}>
            {t('post.noPost')} 🥹
          </Typography>
        );
      break;
    default:
      content = [<p key={0}>Nothing to show</p>];
  }
  return (
    <Box marginBottom={2}>
      <Typography variant="h4" className="section-title">
        {title}
      </Typography>
      <Grid sx={{ marginTop: 0, marginBottom: 1 }} spacing={1} container>
        {content}
      </Grid>
      {allPosts?.length > shownItem && (
        <>
          <Divider />
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? t('button.showLess') : t('button.showAll')}
          </Button>
        </>
      )}
    </Box>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
  shownItem: 3,
  onUpdate: () => null,
};
