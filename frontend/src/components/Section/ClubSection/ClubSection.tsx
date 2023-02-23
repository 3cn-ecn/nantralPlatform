import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import './ClubSection.scss';
import {
  Button,
  Grid,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ChevronRightOutlined, ExpandMore } from '@mui/icons-material';
import { ClubProps } from '../../../Props/Club';
import ClubAvatar from '../../ClubAvatar/ClubAvatar';

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
  const { t } = useTranslation('translation'); // translation module
  const { status, clubs, title, maxItem, seeMoreUrl } = props;
  let content: JSX.Element | Array<JSX.Element>;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const allclubs = maxItem ? clubs.slice(0, maxItem) : clubs;
  switch (status) {
    case 'fail':
      content = <p className="card">{t('event.error')}</p>;
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
              clubUrl={club.get_absolute_url}
              logoUrl={club.logo_url}
              key={club.name}
              size={clubAvatarSize}
            />
          </Grid>
        ));
      } else {
        content = <p className="event-grid">{t('event.no_event')}</p>;
      }
      break;
    default:
      content = null;
  }
  return (
    <Accordion
      variant="outlined"
      className="card"
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <NavLink to={seeMoreUrl} className="see-more">
          <Button
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              ':hover': { backgroundColor: 'ThreeDHighlight' },
            }}
          >
            <h1 className="section-title">{title}</h1>
            <ChevronRightOutlined />
          </Button>
        </NavLink>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={2} container className="event-grid">
          {content}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

ClubSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
};
