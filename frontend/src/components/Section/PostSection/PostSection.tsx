import * as React from 'react';
import { Skeleton, useMediaQuery } from '@mui/material';
import { PostCard } from '../../PostCard/PostCard';
import { PostProps } from '../../../Props/Post';
import Carousel from '../../Carousel/Carousel';
import { theme } from '../../style/palette';
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
}) {
  const { posts, title, maxItem, status } = props;
  const md: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const allPosts = maxItem ? posts.slice(0, maxItem) : posts;
  let content;
  switch (status) {
    case 'fail':
      content = <p>Error</p>;
      break;
    case 'load':
      content = [0, 1, 2].map((item) => (
        <div key={item} style={{ padding: 8 }}>
          <Skeleton key={item} height={110} variant="rectangular" />
        </div>
      ));
      break;
    case 'success':
      content = allPosts.map((post) => (
        <div key={post.slug} style={{ padding: 8 }}>
          <PostCard post={post} />
        </div>
      ));
      break;
    default:
      content = [<p key={0}>Nothing to show</p>];
  }
  return (
    <Carousel itemNumber={md ? 1 : 3} title={`${title} (${posts.length})`}>
      {/* {allPosts.map((post) => (
        <div key={post.slug} style={{ padding: 8, overflow: 'hidden' }}>
          <PostCard post={post} />
        </div>
      ))} */}
      {content}
    </Carousel>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
};
