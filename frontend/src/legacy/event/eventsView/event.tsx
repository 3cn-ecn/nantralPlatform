import * as React from 'react';
import { Card } from 'react-bootstrap';
import { EventInfos } from './interfaces';
import { getDate, getHour } from './utils';

interface EventProps {
  eventInfos: EventInfos;
}

export function Event({ eventInfos }: EventProps): JSX.Element {
  return (
    <Card border="#dc3545" className="mb-2">
      <Card.Img
        variant="top"
        src={eventInfos.image}
        onClick={() => {
          window.location.href = `/event/${eventInfos.id}/`;
        }}
        style={{ cursor: 'pointer' }}
      />
      <Card.Body as="a" href={`/event/${eventInfos.id}/`} className="pb-0 ">
        <small className="text-uppercase card-date">
          {getDate(eventInfos.start_date)}
        </small>
        <Card.Title as="h4">{eventInfos.title}</Card.Title>
        <Card.Subtitle className="mb-3">
          {[
            getHour(eventInfos.start_date),
            eventInfos.location,
            eventInfos.group.name,
          ].join(' • ')}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
}
