import { convertFromPythonData } from '../utils/convertData';
import { SimpleGroupProps } from './Group';

export interface EventProps {
  id?: number; // Id of the event
  color?: string | null; // Color of the event card
  beginDate: Date; // Event begin date in Date format
  endDate: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  getAbsoluteUrl?: string; // url of the event from root url
  group: SimpleGroupProps; // id of the group
  isAdmin: boolean; // if the user can edit the event
  image: string; // uri of the banner
  isMember?: boolean;
  isParticipating?: boolean; // whether connected user particpate at this event
  location: string; // where the event is taking place
  numberOfParticipants?: number;
  publicity: 'Pub' | 'Mem';
  slug?: string; // slug of the event
  title: string;
  maxParticipant?: number | null; // number max of participant
  endRegistration: Date | null; // date of the end of registration
  beginRegistration: Date | null; // date of the beginning of registration
  formUrl: string | null; // url of registration form
  isFavorite?: boolean;
  effectiveSize?: number; // The number of horizontal parts the events will used
  globalSize?: number; // The number of parts available
  position?: number; // The position in number of parts in the calendar
  placed?: boolean; // whether the event has been placed in the calendar
}

export interface FormEventProps {
  beginDate: Date; // Event begin date in Date format
  endDate: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  group: number; // id of the group
  image: string | File; // uri of the banner
  location: string; // where the event is taking place
  publicity: 'Pub' | 'Mem';
  title: string;
  maxParticipant?: number | null; // number max of participant
  endRegistration: Date | null; // date of the end of registration
  beginRegistration: Date | null; // date of the beginning of registration
  formUrl: string | null; // url of registration form
}

export function eventsToCamelCase(events: Array<any>) {
  events.forEach((event) => {
    eventToCamelCase(event);
  });
  return events;
}

export function eventToCamelCase(event: any) {
  // delete when date update to beginDate
  event.begin_date = event.date;

  // delete when endDate defined forEach event
  if (event.end_date === null) {
    event.end_date = new Date(new Date(event.date).getTime() + 3600000);
  }

  return convertFromPythonData(event, {
    beginDate: 'Date',
    endDate: 'Date',
    beginRegistration: 'Date',
    endRegistration: 'Date',
  });
}
