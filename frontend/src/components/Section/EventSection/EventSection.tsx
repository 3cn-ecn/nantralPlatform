import React from 'react';

import { Alert, Grid, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';
import { EventProps, FormEventProps } from '#types/Event';
import { LoadStatus } from '#types/GenericTypes';

import EventCard, { EventCardSkeleton } from '../../EventCard/EventCard';
import { AccordionSection } from '../AccordionSection';
import './EventSection.scss';

function LoadingSkeleton(props: { count: number }) {
  const { count } = props;
  return (
    <>
      {[...Array(count).keys()].map((item, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{ maxWidth: '700px' }}
          key={item + index.toString()}
        >
          <EventCardSkeleton />
        </Grid>
      ))}
    </>
  );
}
/**
 * Une section comportant
 * un titre,
 * un bouton __voir plus__ qui redirige vers une autre page du site,
 * et les événements de `events`
 */
export function EventSection(props: {
  /** L'état de chargement des événements */
  status: LoadStatus;
  /** La liste des événements à afficher */
  events: Array<EventProps>;
  /** Titre de la section */
  title?: string;
  /** Nombre maximal d'événement à afficher */
  maxItem?: number;
  accordion?: boolean;
  /** How many event skeleton to display when loading */
  loadingItemCount?: number;
  onUpdate?: (newEvent: FormEventProps) => void;
  onDelete?: () => void;
}) {
  const { t } = useTranslation(); // translation module
  const {
    status,
    events,
    title,
    maxItem,
    accordion,
    loadingItemCount,
    onUpdate,
    onDelete,
  } = props;
  let content: JSX.Element | Array<JSX.Element>;
  const allEvents = events;
  switch (status) {
    case 'error':
      content = (
        <Alert severity="error" sx={{ marginLeft: 3 }}>
          {t('event.error')}
        </Alert>
      );
      break;
    case 'loading':
      content = <LoadingSkeleton count={loadingItemCount} />;
      break;
    case 'success':
      if (events.length > 0) {
        content = allEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id} flexGrow={1}>
            <EventCard event={event} onUpdate={onUpdate} onDelete={onDelete} />
          </Grid>
        ));
      } else {
        content = (
          <Grid item>
            <Typography sx={{ marginLeft: 3, fontSize: 18 }}>
              {t('event.no_event')} 🥹
            </Typography>
          </Grid>
        );
      }
      break;
    default:
      content = null;
  }
  return (
    <AccordionSection title={title} content={content} accordion={accordion} />
  );
}

EventSection.defaultProps = {
  title: null,
  maxItem: null,
  accordion: false,
  loadingItemCount: 3,
  onUpdate: () => null,
  onDelete: () => null,
};
