import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Grid, Typography } from '@mui/material';

import { Group, SimpleGroup } from '#components/Group/interfaces';
import { LoadStatus } from '#types/GenericTypes';

import { ClubAvatar, ClubAvatarSkeleton } from '../../ClubAvatar/ClubAvatar';
import { AccordionSection } from '../AccordionSection';

const clubAvatarSize = 100;

const LoadingSkeleton = (
  <>
    {[0, 1, 2].map((club) => (
      <Grid item xs={6} sm={4} md={3} lg={2} key={club}>
        <ClubAvatarSkeleton key={club} size={clubAvatarSize} />
      </Grid>
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
  status: LoadStatus;
  /** La liste des événements à afficher */
  clubs: Array<Group | SimpleGroup>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'événement à afficher */
  maxItem?: number;
  accordion?: boolean;
}) {
  const { status, clubs, title, maxItem, accordion } = props;
  let content: JSX.Element | Array<JSX.Element>;
  const allclubs = maxItem && clubs ? clubs.slice(0, maxItem) : clubs;
  const { t } = useTranslation('translation');
  switch (status) {
    case 'error':
      content = <p className="card">Error</p>;
      break;
    case 'loading':
      content = LoadingSkeleton;
      break;
    case 'success':
      if (clubs.length > 0) {
        content = allclubs.map((club) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={club.name}
            sx={{
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
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
        content = (
          <Typography sx={{ marginLeft: 3, fontSize: 18 }}>
            {t('club.noClub')} 🥹 <Link to="/club">{t('club.joinNow')}</Link>
          </Typography>
        );
      }
      break;
    default:
      content = null;
  }
  return (
    <AccordionSection content={content} title={title} accordion={accordion} />
  );
}

ClubSection.defaultProps = {
  title: null,
  maxItem: null,
  accordion: false,
};
