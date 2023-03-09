import * as React from 'react';
import { Badge, Box, Button, Divider, Grid, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PostCard } from '../../PostCard/PostCard';
import { PostProps } from '../../../Props/Post';
import { Status } from '../../../Props/GenericTypes';

/**
 * Une section comportant
 * un titre,
 * un bouton __voir plus__ qui redirige vers une autre page du site,
 * et les événements de `events`
 */
export function PostSection(props: {
  status: Status;
  /** La liste des posts à afficher */
  posts: Array<PostProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'éléments à afficher */
  maxItem?: number;
  /** Nombre d'item à afficher de base */
  shownItem?: number;
}) {
  const { posts, title, maxItem, status, shownItem } = props;
  const allPosts = maxItem ? posts.slice(0, maxItem) : posts;
  const { t } = useTranslation('translation');
  const [showAll, setShowAll] = React.useState<boolean>(false);
  let content;
  switch (status) {
    case 'fail':
      content = <p>Error</p>;
      break;
    case 'load':
      content = [0, 1, 2].map((item) => (
        <Grid key={item} xs={12} md={4} item>
          <Skeleton key={item} height={110} variant="rectangular" />
        </Grid>
      ));
      break;
    case 'success':
      content = allPosts
        .slice(0, showAll ? allPosts.length : shownItem)
        .map((post) => (
          <Grid key={post.slug} xs={12} md={4} item>
            <PostCard post={post} />
          </Grid>
        ));
      break;
    default:
      content = [<p key={0}>Nothing to show</p>];
  }
  return (
    <Box marginBottom={2}>
      <h2 className="section-title">
        {title}
        <Badge
          badgeContent={posts.length}
          color="primary"
          sx={{ marginLeft: 2, zIndex: 0 }}
        />
      </h2>
      <Grid sx={{ marginTop: 0, marginBottom: 1 }} spacing={1} container>
        {content}
      </Grid>
      <Divider />
      {allPosts.length > shownItem && (
        <Button onClick={() => setShowAll(!showAll)}>
          {showAll ? t('button.showLess') : t('button.showAll')}
        </Button>
      )}
    </Box>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
  shownItem: 3,
};
