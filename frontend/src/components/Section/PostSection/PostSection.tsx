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
  /** L'état de chargement des événements */
  status: 'success' | 'fail' | 'load';
  /** La liste des événements à afficher */
  posts: Array<PostProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'événement à afficher */
  maxItem?: number;
  /** url relative du bouton voir plus */
  seeMoreUrl?: string;
}) {
  const { t } = useTranslation('translation'); // translation module
  const { status, posts, title, maxItem, seeMoreUrl } = props;
  const [windowSize, setWindowSize] = React.useState(window.innerWidth);
  window.addEventListener('resize', () => {
    setWindowSize(window.innerWidth);
  });
  let myEventsContent: any;
  const allEvents = maxItem ? posts.slice(0, maxItem) : posts;
  switch (status) {
    case 'fail':
      myEventsContent = <p className="card">{t('event.error')}</p>;
      break;
    case 'load':
      myEventsContent = LoadingSkeleton;
      break;
    case 'success':
      if (posts.length > 0) {
        myEventsContent = allEvents.map((post) => (
          <div key={post.slug}>
            <div style={{ padding: 8 }}>
              <PostCard
                title={post.title}
                imageUri={post.image}
                club={post.group}
                key={post.slug}
              />
            </div>
          </div>
        ));
      } else {
        myEventsContent = <p className="event-grid">{t('event.no_event')}</p>;
      }
      break;
    default:
      myEventsContent = null;
  }
  return (
    <Carousel
      itemNumber={windowSize > 800 ? 3 : 1}
      title={`${title} (${posts.length})`}
    >
      {allEvents.map((post) => (
        <div key={post.slug} style={{ padding: 8 }}>
          <PostCard
            title={post.title}
            imageUri={post.image}
            club={post.group}
            key={post.slug}
            description={post.description}
            pinned={post.pinned}
          />
        </div>
      ))}
    </Carousel>
  );
}

PostSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
};
