import * as React from 'react';
import { Grid, Skeleton } from '@mui/material';
import { ClubProps } from '../../../Props/Club';
import ClubAvatar from '../../ClubAvatar/ClubAvatar';
import { AccordionSection } from '../AccordionSection';

const clubAvatarSize = 100;

const LoadingSkeleton = (
  <>
    {[0, 1, 2].map((club) => (
      <Skeleton
        key={club}
        variant="circular"
        height={clubAvatarSize}
        width={clubAvatarSize}
        sx={{ margin: '10px' }}
      />
    ))}
  </>
);
/**
 * Une section comportant
 * un titre,
 * un bouton __voir plus__ qui redirige vers une autre page du site,
 * et les événements de `clubs`
 */
export function ClubSection(props: {
  /** L'état de chargement des événements */
  status: 'success' | 'fail' | 'load';
  /** La liste des événements à afficher */
  clubs: Array<ClubProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'événement à afficher */
  maxItem?: number;
  /** url relative du bouton voir plus */
  seeMoreUrl?: string;
}) {
  const { status, clubs, title, maxItem, seeMoreUrl } = props;
  let content: JSX.Element | Array<JSX.Element>;
  const allclubs = maxItem ? clubs.slice(0, maxItem) : clubs;

  switch (status) {
    case 'fail':
      content = <p className="card">Error</p>;
      break;
    case 'load':
      content = LoadingSkeleton;
      break;
    case 'success':
      if (clubs.length > 0) {
        content = allclubs.map((club) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={club.name}>
            <ClubAvatar
              name={club.name}
              clubUrl={club.url}
              logoUrl={club.icon}
              key={club.name}
              size={clubAvatarSize}
            />
          </Grid>
        ));
      } else {
        content = <p className="event-grid">Nothing to show</p>;
      }
      break;
    default:
      content = null;
  }
  return (
    <AccordionSection
      content={content}
      title={title}
      url={seeMoreUrl}
      badge={clubs.length}
    />
  );
}

ClubSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
};
