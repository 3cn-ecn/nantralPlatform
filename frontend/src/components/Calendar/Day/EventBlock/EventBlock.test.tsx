import React from 'react';
import { EventProps } from 'Props/Event';
import { renderer } from 'react-test-renderer';
import { EventBlock } from './EventBlock';

it('test', () => {
  const event: EventProps = {
    color: 'blue',
    beginDate: new Date(),
    endDate: new Date(new Date().getTime() + 3600000),
    description: 'This is an event to test',
    getAbsoluteUrl: 'https://nantral-platform.fr/account/login/?next=/',
    getGroupName: 'Moi-même',
    group: 'Mon groupe',
    image: null,
    isMember: true,
    isParticipating: true,
    location: 'My home',
    numberOfParticipants: 15,
    publicity: 'Pub',
    slug: 'The slug',
    title: 'The test event',
    maxParticipant: null,
    endInscription: null,
    beginInscription: null,
    ticketing: null,
    isFavorite: true,
    effectiveSize: 1,
    globalSize: 1,
    position: 0,
    placed: false,
  };

  const component = renderer.create(
    <EventBlock key={event.slug} day={1} event={event} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
