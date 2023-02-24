import { Button, Card, Grid, Skeleton } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { PostCard } from '../../PostCard/PostCard';
import { PostProps } from '../../../Props/Post';
import './PostSection.scss';
import Carousel from '../../Carousel/Carousel';

export function SectionTitle(props: {
  title: string;
  url: string;
}): JSX.Element {
  const { t } = useTranslation('translation'); // translation module
  const { title, url } = props;
  return (
    <span className="section">
      <h1 className="section-title">{title}</h1>
      {url && (
        <NavLink to={url} className="see-more">
          <Button>{t('home.seeMore')}</Button>
        </NavLink>
      )}
    </span>
  );
}
const LoadingSkeleton = (
  <>
    {[0, 1, 2].map((item) => (
      <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: '700px' }} key={item}>
        <Skeleton
          variant="rectangular"
          key={item}
          style={{ borderRadius: 5, height: '18.75em' }}
        />
      </Grid>
    ))}
  </>
);
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
