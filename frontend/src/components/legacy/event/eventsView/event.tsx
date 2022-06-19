import * as React from 'react';
import { EventInfos } from './interfaces';
import { ParticipateButton } from './participateButton';
import { Card } from 'react-bootstrap';
import { getDate, getHour } from './utils';

export function Event(props): JSX.Element {
  const urls = props.urls;
  const eventInfos: EventInfos = props.eventInfos;

  return (
    <Card border={eventInfos.color} className="mb-2">
      <Card.Img
        variant="top"
        src={eventInfos.image}
        onClick={(e) => {
          window.location.href = eventInfos.get_absolute_url;
        }}
        style={{ cursor: 'pointer' }}
      />
      <Card.Body as="a" href={eventInfos.get_absolute_url} className="pb-0 ">
        <small className="text-uppercase card-date">
          {getDate(eventInfos.date)}
        </small>
        <Card.Title as="h4">{eventInfos.title}</Card.Title>
        <Card.Subtitle className="mb-3">
          {getHour(eventInfos.date)} • {eventInfos.location} •{' '}
          {eventInfos.get_group_name}
        </Card.Subtitle>
      </Card.Body>
      <Card.Body className="pt-0">
        <ParticipateButton
          number_of_participants={eventInfos.number_of_participants}
          urls={urls}
          eventInfos={eventInfos}
        />
      </Card.Body>
    </Card>
  );
}
