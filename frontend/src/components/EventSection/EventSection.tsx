import { Button, Card, Grid, Skeleton } from '@mui/material';
import { EventProps } from 'Props/Event';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import EventCard from '../EventCard/EventCard';
import './EventSection.scss';

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
    {[0, 1, 2].map((item, key) => (
      <Skeleton
        variant="rectangular"
        width={Math.min(
          (Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ) *
            2) /
            3,
          450
        )}
        height={Math.min(
          Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ) / 2,
          300
        )}
        key={item}
        style={{ margin: 10, borderRadius: 10 }}
      />
    ))}
  </>
);

export function EventSection(props: {
  status: 'success' | 'error' | 'loading'; // L'état de chargement des événements
  events: Array<EventProps>; // La liste des événements à afficher
  title?: string; // Titre de la section
  maxItem?: number; // Nombre maximal d'événement à afficher
  seeMoreUrl?: string; // URL du bouton voir plus
}) {
  const { t } = useTranslation('translation'); // translation module
  const { status, events, title, maxItem, seeMoreUrl } = props;
  let myEventsContent: JSX.Element | Array<JSX.Element>;
  const allEvents = maxItem ? events.slice(0, maxItem) : events;
  switch (status) {
    case 'error':
      myEventsContent = null;
      break;
    case 'loading':
      myEventsContent = LoadingSkeleton;
      break;
    case 'success':
      if (events.length > 0) {
        myEventsContent = allEvents.map((event) => (
          <EventCard event={event} key={event.slug} />
        ));
      } else {
        myEventsContent = <p>{t('event.no_event')}</p>;
      }
      break;
    default:
      myEventsContent = null;
  }
  return (
    <Card variant="outlined" className="card">
      <SectionTitle title={title} url={seeMoreUrl} />
      <Grid spacing={0} container className="upcoming-event">
        {myEventsContent}
      </Grid>
    </Card>
  );
}

EventSection.defaultProps = {
  title: null,
  maxItem: null,
  seeMoreUrl: null,
};
