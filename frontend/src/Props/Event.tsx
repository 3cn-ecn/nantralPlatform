import { snakeToCamelCase } from '../utils/camel';

export interface EventProps {
  id?: number; // Id of the event
  color?: string | null; // Color of the event card
  beginDate: Date; // Event begin date in Date format
  endDate: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  getAbsoluteUrl?: string; // url of the event from root url
  group: number; // id of the group
  groupSlug?: string; // slug of the organiser
  groupName?: string; // name of the organiser
  image: string | null; // uri of the banner
  isMember?: boolean;
  isParticipating?: boolean; // whether connected user particpate at this event
  location: string; // where the event is taking place
  numberOfParticipants?: number;
  publicity: 'Pub' | 'Mem';
  slug?: string; // slug of the event
  title: string;
  maxParticipant?: number | null; // number max of participant
  endInscription: Date | null; // date of the end of inscription
  beginInscription: Date | null; // date of the beginning of inscription
  formUrl: string | null; // url of inscription form
  isFavorite?: boolean;
  effectiveSize?: number; // The number of horizontal parts the events will used
  globalSize?: number; // The number of parts available
  position?: number; // The position in number of parts in the calendar
  placed?: boolean; // whether the event has been placed in the calendar
}

export interface FormEventProps {
  date: Date; // Event begin date in Date format
  end_date: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  group: number; // id of the group
  image: string | File; // uri of the banner
  location: string; // where the event is taking place
  publicity: 'Pub' | 'Mem';
  title: string;
  max_participant?: number | null; // number max of participant
  end_inscription: Date | null; // date of the end of inscription
  begin_inscription: Date | null; // date of the beginning of inscription
  form_url: string | null; // url of inscription form
}

export function eventsToCamelCase(events: Array<any>): void {
  events.forEach((event) => {
    // delete when date update to beginDate
    event.begin_date = event.date;

    // delete when endDate defined forEach event
    if (event.end_date === null) {
      event.end_date = new Date(new Date(event.date).getTime() + 3600000);
    }

    snakeToCamelCase(event, {
      beginDate: 'Date',
      endDate: 'Date',
      beginInscription: 'Date',
      endInscription: 'Date',
    });
  });
}
