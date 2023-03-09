import { EventProps } from 'Props/Event';
import * as React from 'react';
import { Grid, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EventCard from '../../EventCard/EventCard';
import './EventSection.scss';
import { AccordionSection } from '../AccordionSection';

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
  collapsable?: boolean;
}) {
  const { t } = useTranslation('translation'); // translation module
  const { status, events, title, maxItem, seeMoreUrl, collapsable } = props;
  let content: JSX.Element | Array<JSX.Element>;
  const allEvents = maxItem ? events.slice(0, maxItem) : events;
  switch (status) {
    case 'fail':
      content = <p className="card">{t('event.error')}</p>;
      break;
    case 'load':
      content = LoadingSkeleton;
      break;
    case 'success':
      if (events.length > 0) {
        content = allEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.slug}>
            <EventCard event={event} />
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
    <AccordionSection
      title={title}
      badge={events.length}
      content={content}
      url={seeMoreUrl}
      collapsable={collapsable}
    />
  );
}

EventSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
  collapsable: true,
};
