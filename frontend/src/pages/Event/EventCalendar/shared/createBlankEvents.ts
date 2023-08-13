import {
  addHours,
  differenceInCalendarDays,
  differenceInHours,
} from 'date-fns';

import { EventPreview } from '#modules/event/event.type';
import { getMockEventPreview } from '#modules/event/infra/event.mock';

function hash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function createBlankEvents(
  fromDate: Date,
  toDate: Date
): EventPreview[] {
  const events = new Array<EventPreview>();
  const numberOfHours = differenceInHours(toDate, fromDate);
  const numberOfDays = differenceInCalendarDays(toDate, fromDate);

  const dateStr = `${fromDate}-${toDate}`;
  const numberOfEvents = (hash(dateStr) % numberOfDays) + numberOfDays / 2 || 2;

  for (let i = 0; i < numberOfEvents; i++) {
    const startHour = hash(dateStr + i * 543) % (numberOfHours - 5); // Between 0 PM and 19 PM
    const duration = (hash(dateStr + 'duration' + i * 345) % 4) + 2; // Between 2 and 5 hours
    events.push(
      getMockEventPreview({
        id: i,
        startDate: addHours(fromDate, startHour),
        endDate: addHours(fromDate, startHour + duration),
      })
    );
  }

  return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}
