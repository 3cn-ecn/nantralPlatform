import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { PostCard } from '../../PostCard/PostCard';
import { PostProps } from '../../../Props/Post';
import Carousel from '../../Carousel/Carousel';
import { theme } from '../../style/palette';

/**
 * Une section comportant
 * un titre,
 * un bouton __voir plus__ qui redirige vers une autre page du site,
 * et les événements de `events`
 */
export function PostSection(props: {
  /** La liste des posts à afficher */
  posts: Array<PostProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'éléments à afficher */
  maxItem?: number;
}) {
  const { posts, title, maxItem } = props;
  const md: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const allPosts = maxItem ? posts.slice(0, maxItem) : posts;
  return (
    <Carousel itemNumber={md ? 1 : 3} title={`${title} (${posts.length})`}>
      {allPosts.map((post) => (
        <div key={post.slug} style={{ padding: 8, overflow: 'hidden' }}>
          <PostCard post={post} />
        </div>
      ))}
    </Carousel>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
};
