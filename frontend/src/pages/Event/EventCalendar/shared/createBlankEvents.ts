import { addDays, addHours, differenceInCalendarDays } from 'date-fns';

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
  toDate: Date,
): EventPreview[] {
  const numberOfDays = differenceInCalendarDays(toDate, fromDate) + 1;

  return Array.from({ length: numberOfDays }, (_, i) => {
    const currentDay = addDays(fromDate, i);
    const startHour = hash(currentDay.toISOString()) % 20; // Between 0 PM and 19 PM
    const duration = (hash(currentDay.toUTCString()) % 4) + 2; // Between 2 and 5 hours

    return getMockEventPreview({
      id: i,
      startDate: addHours(currentDay, startHour),
      endDate: addHours(currentDay, startHour + duration),
    });
  });
}
