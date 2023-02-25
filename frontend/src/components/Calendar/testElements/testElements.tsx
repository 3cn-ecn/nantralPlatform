import { EventProps } from '../../../Props/Event';

export function createTestEvent() {
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

  return event;
}
