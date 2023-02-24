import * as React from 'react';
import { PostCard } from '../../PostCard/PostCard';
import { PostProps } from '../../../Props/Post';
import Carousel from '../../Carousel/Carousel';

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
  const [windowSize, setWindowSize] = React.useState(window.innerWidth);
  window.addEventListener('resize', () => {
    setWindowSize(window.innerWidth);
  });
  const allPosts = maxItem ? posts.slice(0, maxItem) : posts;
  return (
    <Carousel
      itemNumber={windowSize > 800 ? 3 : 1}
      title={`${title} (${posts.length})`}
    >
      {allPosts.map((post) => (
        <div key={post.slug} style={{ padding: 8, overflow: 'hidden' }}>
          <PostCard
            title={post.title}
            imageUri={post.image}
            club={post.group_slug}
            key={post.slug}
            description={post.description}
            pinned={post.pinned}
            pageLink={post.page_suggestion}
          />
        </div>
      ))}
    </Carousel>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
};
