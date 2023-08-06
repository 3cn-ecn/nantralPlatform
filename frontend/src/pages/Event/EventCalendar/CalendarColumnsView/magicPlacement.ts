import {
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  max,
  min,
  startOfDay,
} from 'date-fns';

import { EventPreview } from '#modules/event/event.type';

import { CalendarEventItem } from '../types';

type CalendarEventItemTemp1 = Pick<CalendarEventItem, 'data' | 'start' | 'end'>;
type CalendarEventItemTemp2 = Pick<
  CalendarEventItem,
  'data' | 'start' | 'end' | 'col'
>;

/**
 * Check if an event does overlap with one of the events of a group.
 *
 * @param event - the event to check
 * @param group - a group of overlapping events
 * @returns - true if the event overlaps with one of the events of the group
 */
function eventIsOverlappingGroup(
  event: CalendarEventItemTemp1,
  group: CalendarEventItemTemp1[]
) {
  return group.some((groupEvent) => areIntervalsOverlapping(event, groupEvent));
}

/**
 * Get the max value for the col property of an event in a group of events
 *
 * @param group - the group of events to compare
 * @returns - the max value for col
 */
function getMaxCol(group: CalendarEventItemTemp2[]) {
  return group.reduce((maxCol, event) => Math.max(maxCol, event.col), 0);
}

/**
 * Generate the placement of all events on the calendar
 *
 * @param events - the list of events to place
 * @param onDate - the date on which the events should be placed
 * @returns - the list of events with their placement
 */
export function magicPlacement(
  events: EventPreview[],
  onDate: Date
): CalendarEventItem[] {
  // create new types with start and end keys
  const calendarEvents: CalendarEventItemTemp1[] = events.map((event) => ({
    data: event,
    start: max([event.startDate, startOfDay(onDate)]),
    end: min([
      max([event.endDate, addMinutes(event.startDate, 30)]), // minimum duration of 30 minutes on the calendar view
      startOfDay(addDays(onDate, 1)),
    ]),
  }));

  // sort events in groups of overlapping events
  const groupsOfOverlappingEvents = calendarEvents.reduce((groups, event) => {
    // we only need to check the last group because events are sorted
    const lastGroup = groups.at(-1);
    if (lastGroup && eventIsOverlappingGroup(event, lastGroup)) {
      lastGroup.push(event);
    } else {
      const newGroup = [event];
      groups.push(newGroup);
    }
    return groups;
  }, [] as Array<CalendarEventItemTemp1[]>);

  // for each overlapping group of events, assign a column to each event
  const groupsOfOverlappingEventsWithCols = groupsOfOverlappingEvents.map(
    (group) => {
      return group.reduce((groupWithCols, event) => {
        const overlappingEvents = groupWithCols.filter((e) =>
          areIntervalsOverlapping(event, e)
        );
        const firstEmptyCol = Math.min(
          ...Array.from({ length: getMaxCol(overlappingEvents) + 2 }, (_, i) =>
            overlappingEvents.some((e) => e.col === i) ? Infinity : i
          )
        );

        const eventWithCol = { ...event, col: firstEmptyCol };
        return groupWithCols.concat([eventWithCol]);
      }, [] as Array<CalendarEventItemTemp2>);
    }
  );

  // for each group, add the max col to all of its events
  const groups = groupsOfOverlappingEventsWithCols.map((group) => {
    const nbTotCols = getMaxCol(group) + 1;
    return group.map((event) => ({ ...event, nbTotCols }));
  });

  // remove groups to get a single list of events
  const calendarEventItems = groups.flat();

  return calendarEventItems;
}
