import { EventProps } from '../../../Props/Event';

export function createTestEvent() {
  const event: EventProps = {
    color: 'blue',
    beginDate: new Date('2023-02-17T03:24:00'),
    endDate: new Date('2023-02-17T04:24:00'),
    description: 'This is an event to test',
    getAbsoluteUrl: 'https://nantral-platform.fr/account/login/?next=/',
    groupName: 'Moi-même',
    groupSlug: 'Mon groupe',
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
    formUrl: null,
    isFavorite: true,
    effectiveSize: 1,
    globalSize: 1,
    position: 0,
    placed: false,
  };

  return event;
}
