import { ChevronRightOutlined, ExpandMore } from '@mui/icons-material';
import { EventProps } from 'Props/Event';
import * as React from 'react';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Button,
  Grid,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import EventCard from '../../EventCard/EventCard';
import './EventSection.scss';

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
export function EventSection(props: {
  /** L'état de chargement des événements */
  status: 'success' | 'fail' | 'load';
  /** La liste des événements à afficher */
  events: Array<EventProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'événement à afficher */
  maxItem?: number;
  /** url relative du bouton voir plus */
  seeMoreUrl?: string;
}) {
  const { t } = useTranslation('translation'); // translation module
  const { status, events, title, maxItem, seeMoreUrl } = props;
  let myEventsContent: JSX.Element | Array<JSX.Element>;
  const allEvents = maxItem ? events.slice(0, maxItem) : events;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  switch (status) {
    case 'fail':
      myEventsContent = <p className="card">{t('event.error')}</p>;
      break;
    case 'load':
      myEventsContent = LoadingSkeleton;
      break;
    case 'success':
      if (events.length > 0) {
        myEventsContent = allEvents.map((event) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ maxWidth: '700px' }}
            key={event.slug}
          >
            <EventCard event={event} />
          </Grid>
        ));
      } else {
        myEventsContent = <p className="event-grid">{t('event.no_event')}</p>;
      }
      break;
    default:
      myEventsContent = null;
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
          <Button sx={{ textTransform: 'none', color: 'text.primary' }}>
            <h1 className="section-title">{title}</h1>
            <ChevronRightOutlined />
          </Button>
        </NavLink>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={2} container className="event-grid">
          {myEventsContent}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

EventSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
};
