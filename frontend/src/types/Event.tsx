import { convertFromPythonData } from '#shared/utils/convertData';

export type registrationType = 'normal' | 'form' | 'shotgun';

export interface FormEventProps {
  startDate: Date; // Event begin date in Date format
  endDate: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  group: number; // id of the group
  image: string | File; // uri of the banner
  location: string; // where the event is taking place
  publicity: 'Pub' | 'Mem';
  title: string;
  maxParticipant?: number | null; // number max of participant
  endRegistration: Date | null; // date of the end of registration
  startRegistration: Date | null; // date of the beginning of registration
  formUrl: string | null; // url of registration form
}

export function eventsToCamelCase(events: Array<any>) {
  events.forEach((event) => {
    eventToCamelCase(event);
  });
  return events;
}

export function eventToCamelCase(event: any) {
  // delete when endDate defined forEach event
  if (event.end_date === null) {
    event.end_date = new Date(new Date(event.date).getTime() + 3600000);
  }

  return convertFromPythonData(event, {
    startDate: 'Date',
    endDate: 'Date',
    startRegistration: 'Date',
    endRegistration: 'Date',
  });
}
