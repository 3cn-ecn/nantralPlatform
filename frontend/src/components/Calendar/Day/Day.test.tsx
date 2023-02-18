import React from 'react';
import { render } from '@testing-library/react';
import { EventProps } from '../../../Props/Event';
import { Day } from './Day';

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
describe('<Day />', () => {
  it('should display a Day', async () => {
    const component = render(
      <Day
        dayValue={event.beginDate.getDay()}
        day="Vendredi"
        events={[event]}
        chains={[[0]]}
      />
    );
    // console.log(component.getByText('GlobalDayContainer').style.transform);
    // expect(component.getByText('GlobalDayContainer').style.transform).toBe(
    //   `translate(0px, ${20 * 21.6}px)`
    // );
    expect(component).toMatchSnapshot();
  });
});
