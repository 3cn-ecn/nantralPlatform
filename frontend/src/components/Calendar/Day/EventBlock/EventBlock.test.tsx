import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../../../Props/Event';
import { EventBlock } from './EventBlock';

const event: EventProps = {
  color: 'blue',
  beginDate: new Date('2023-02-17T03:24:00'),
  endDate: new Date('2023-02-17T04:24:00'),
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
describe('<EventBlock />', () => {
  it('should display an EventBlock', async () => {
    const component = render(
      <EventBlock day={event.beginDate.getDay()} event={event} />
    );
    expect(component.getByRole('button').style.height).toBe('20px');
    expect(component.getByRole('button').style.padding).toBe('0px');
    expect(component).toMatchSnapshot();
  });
});