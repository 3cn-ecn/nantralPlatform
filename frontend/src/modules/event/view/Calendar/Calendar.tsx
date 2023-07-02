import { useEffect, useState } from 'react';

import { Button, Grid } from '@mui/material';
import { EventAttributes, createEvents } from 'ics';

import { EventCalendarItem } from '#modules/event/event.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { modulo, ppcm } from '#shared/utils/maths';

import './Calendar.scss';
import { CalendarView, EventDataProps } from './CalendarProps/CalendarProps';
import { ChooseDisplay } from './ChooseDisplay/ChooseDisplay';
import { ChooseWeek } from './ChooseWeek/ChooseWeek';
import { Day } from './Day/Day';
import { DayInfos } from './DayInfos/DayInfos';
import { Month } from './Month/Month';
import { numberOfDayInDateMonth } from './utils';

/**
 * Function that sort event date-wise.
 * @param events The list of the events to sort.
 * @param startDate The minimal date.
 * @param endDate The maximal date.
 * @returns The list of events which take place between the startDate and the Date.
 */
function getEventWithDate(
  events: Array<EventCalendarItem>,
  startDate: Date,
  endDate: Date
): Array<EventCalendarItem> {
  const sortedEvents = new Array<EventCalendarItem>();
  events.forEach((event) => {
    // Sort with end date too.
    if (
      (startDate <= event.startDate && event.startDate < endDate) ||
      (event.startDate <= startDate && startDate < event.endDate)
    ) {
      sortedEvents.push(event);
    }
  });
  return sortedEvents;
}

/**
 * Function to get if the events take place in same time.
 * @param event The first eventData.
 * @param event2Compare The second eventData, to compare with the first one.
 * @returns If the events are ocurring in same time.
 */
function sameTime(
  event: EventDataProps,
  event2Compare: EventDataProps
): boolean {
  if (
    (event.startDate < event2Compare.startDate &&
      event2Compare.startDate < event.endDate) ||
    (event.startDate < event2Compare.endDate &&
      event2Compare.startDate < event.endDate) ||
    (event2Compare.startDate < event.startDate &&
      event.startDate < event2Compare.endDate) ||
    (event2Compare.startDate < event.endDate &&
      event.startDate < event2Compare.endDate)
  ) {
    return true;
  }

  return false;
}

/**
 * Function that returns if an event have a common time area with a list of events that have a common time area.
 * @param key The key of the event to check.
 * @param eventsList The list of key of the events which with the event has to be checked.
 * @param eventsData The list of all eventData.
 * @returns If all the events have a common time area.
 */
function allSameTime(
  key: number,
  eventsList: Array<number>,
  eventsData: Array<EventDataProps>
): boolean {
  let areSameTime = true;
  let iterator = 0;
  while (areSameTime && iterator < eventsList.length) {
    areSameTime = sameTime(eventsData[key], eventsData[eventsList[iterator]]);
    iterator += 1;
  }
  return areSameTime;
}

/**
 * Add chains in event blochedChains.
 * @param blockedEventsChain The list of couples events with maximal events foreach events
 * @param currentChains A list of chains events.
 */
function addInBlockedChains(
  blockedEventsChain: Array<Array<number>>,
  currentChains: Array<Array<number>>
): void {
  let chainEventKey: number;
  let isInclude: boolean;
  currentChains.forEach((chain: Array<number>) => {
    chainEventKey = 0;
    if (blockedEventsChain.length > 0) {
      isInclude = !chain.every((eventKey: number) =>
        blockedEventsChain[chainEventKey].includes(eventKey)
      );
      while (isInclude) {
        chainEventKey += 1;
        if (chainEventKey < blockedEventsChain.length) {
          const chainContainer = blockedEventsChain[chainEventKey];
          isInclude = !chain.every((eventKey: number) =>
            chainContainer.includes(eventKey)
          );
        } else {
          isInclude = false;
        }
      }
    }
    if (chainEventKey >= blockedEventsChain.length) {
      blockedEventsChain.push(chain);
    }
  });
}

/**
 * Get couples of events with maximal events foreach event and set the size of each event with it.
 * @param events List of events.
 * @param eventsData List of events data.
 * @returns The couples of events with maximal size foreach events.
 */
function blockedChains(
  events: Array<EventCalendarItem>,
  eventsData: Array<EventDataProps>
): Array<Array<number>> {
  const currentSizeObject = {
    maxSize: 0,
    blockedChains: [],
  };
  let previousMaxSize: number;
  const blockedEventsChain = [];
  let globalSize = 1;

  eventsData.forEach((eventData) => {
    currentSizeObject.maxSize = 0;
    eventData.coupleEvents.forEach((eventList) => {
      currentSizeObject.maxSize = Math.max(
        eventList.length,
        currentSizeObject.maxSize
      );
      if (currentSizeObject.maxSize !== previousMaxSize) {
        currentSizeObject.blockedChains = [];
        previousMaxSize = currentSizeObject.maxSize;
      }
      if (eventList.length === currentSizeObject.maxSize) {
        currentSizeObject.blockedChains.push(eventList);
      }
    });
    addInBlockedChains(blockedEventsChain, currentSizeObject.blockedChains);
    eventData.size = currentSizeObject.maxSize;
    globalSize = ppcm(currentSizeObject.maxSize, globalSize);
  });

  eventsData.forEach((currentEventData) => {
    events[currentEventData.key].globalSize = globalSize;
    events[currentEventData.key].effectiveSize =
      globalSize / currentEventData.size;
  });

  return blockedEventsChain;
}

/**
 * Create list of couples of events that occurs in same time and store them in eventData.
 * @param eventsData List of events data.
 */
function createCoupleEvents(eventsData: Array<EventDataProps>): void {
  let coupleEventsLength: number;
  eventsData.forEach((eventData) => {
    eventData.sameTimeEvent.forEach((index) => {
      coupleEventsLength = eventData.coupleEvents.length;
      for (let k = 0; k < coupleEventsLength; k++) {
        if (allSameTime(index, eventData.coupleEvents[k], eventsData)) {
          eventData.coupleEvents.push(
            eventData.coupleEvents[k].concat([index])
          );
        }
      }
      eventData.coupleEvents.push([index]);
    });
  });
}

/**
 * Function that resizes all events to take the maximal horizontal space.
 * @param blockedEventsChain List of events chain that have to take all horizontal space.
 * @param events List of events.
 * @param eventsData List of events data.
 */
function eventSizeReajust(
  blockedEventsChain: Array<Array<number>>,
  events: Array<EventCalendarItem>,
  eventsData: Array<EventDataProps>
): void {
  let event2reajust: Array<number>;
  let size2Add: number;
  let sizeUsed: number;
  blockedEventsChain.forEach((eventChain) => {
    sizeUsed = 0;
    event2reajust = [];
    eventChain.forEach((eventKey) => {
      sizeUsed += events[eventKey].effectiveSize;
      if (!eventsData[eventKey].blocked) {
        event2reajust.push(eventKey);
      }
    });
    if (event2reajust.length !== 0) {
      size2Add = (events[0].globalSize - sizeUsed) / event2reajust.length;
      event2reajust.forEach((eventKey) => {
        events[eventKey].effectiveSize += size2Add;
        eventsData[eventKey].blocked = true;
      });
    }
  });
}

/**
 * Function that add blanked events to fill chains. Blanked Events have only a key that is the opposite of their size.
 * @param blockedEventsChain List of events chain that have to take all horizontal space.
 * @param events List of events.
 */
function addBlankedEvents(
  blockedEventsChain: Array<Array<number>>,
  events: Array<EventCalendarItem>
): void {
  let cumulateSize: number;
  blockedEventsChain.forEach((chain) => {
    cumulateSize = 0;
    chain.forEach((event) => {
      cumulateSize += events[event].effectiveSize;
    });
    if (cumulateSize !== events[0].globalSize) {
      chain.push(cumulateSize - events[0].globalSize);
    }
  });
}

/**
 * Call functions to place the next events in the chains list
 * @param blanked Wheter current event is blanked
 * @param events List of events.
 * @param chain List of keys of current simultaneous events that are placed.
 * @param eventsBlockedChain List of chains with simultaneous events that have to be placed.
 * @param position The position where the event has to be placed.
 * @param select The current index in eventsBlockedChain[0] of the key of the event that is placed.
 * @returns Then next index in eventsBlockedChain[0] of the key of the event that will be placed and a boolean to tell if the chain is totally placed
 * @param changePlacement Whether the current event has been placed this iteration.
 * @returns The next index in eventsBlockedChain[0] of the key of the event that will be placed and a boolean to tell if the chain is totally placed
 */
function placeNextEvents(
  blanked: boolean,
  events: Array<EventCalendarItem>,
  chain: Array<number>,
  eventsBlockedChain: Array<Array<number>>,
  position: number,
  select: number,
  changePlacement: boolean
): { newSelect: number; chainPlaced: boolean } {
  let newSelect = select;
  let chainPlaced = false;

  const tempEventBlockedChain: Array<Array<number>> =
    eventsBlockedChain.slice();
  tempEventBlockedChain[0] = eventsBlockedChain[0]
    .slice(0, select)
    .concat(eventsBlockedChain[0].slice(select + 1));

  if (!blanked) {
    if (
      !placeEvents(
        events,
        chain,
        tempEventBlockedChain,
        position + events[eventsBlockedChain[0][select]].effectiveSize
      )
    ) {
      // Fail to place the next event
      if (changePlacement) {
        events[eventsBlockedChain[0][select]].placed = false;
      }
      newSelect += 1;
    } else {
      chainPlaced = true;
    }
  } else if (
    !placeEvents(
      events,
      chain,
      tempEventBlockedChain,
      position - eventsBlockedChain[0][select]
    )
  ) {
    // Fail to place the next event which is blanked
    newSelect += 1;
  } else {
    chainPlaced = true;
  }
  return { newSelect, chainPlaced };
}

/**
 * A function that check if the placement of an event corresponds with an event chain. If the event is not already placed, this function places it.
 * @param events List of events.
 * @param chain List of keys of current simultaneous events that are placed.
 * @param eventsBlockedChain List of chains with simultaneous events that have to be placed.
 * @param position The position where the event has to be placed.
 * @param select The current index in eventsBlockedChain[0] of the key of the event that is placed.
 * @returns Then next index in eventsBlockedChain[0] of the key of the event that will be placed and a boolean to tell if the chain is totally placed
 */
function placeChainEvent(
  events: Array<EventCalendarItem>,
  chain: Array<number>,
  eventsBlockedChain: Array<Array<number>>,
  position: number,
  select: number
): { newSelect: number; chainPlaced: boolean } {
  let newSelect = select;
  let chainPlaced = false;
  let changePlacement = false;
  let eventPlaced = true;

  // Set if it's a blanked event
  const blanked = eventsBlockedChain[0][select] < 0;

  // If the event has not been already placed yet
  // Then checked if the event can be placed
  if (!blanked) {
    if (!events[eventsBlockedChain[0][select]].placed) {
      changePlacement = true;
      events[eventsBlockedChain[0][select]].placed = true;
      events[eventsBlockedChain[0][select]].position = position;
    } else if (events[eventsBlockedChain[0][select]].position !== position) {
      newSelect += 1;
      eventPlaced = false;
    }
  }

  // Only if the current event has been able to be placed, while the event placed doesn't able a good placement for all events, change the event which is placed in position.
  if (eventPlaced) {
    const newValues = placeNextEvents(
      blanked,
      events,
      chain,
      eventsBlockedChain,
      position,
      select,
      changePlacement
    );
    newSelect = newValues.newSelect;
    chainPlaced = newValues.chainPlaced;
  }
  return { newSelect, chainPlaced };
}

/**
 * Recursive function that set an event horizontal position (when multiples events occur in same time).
 * @param events List of events.
 * @param chain List of keys of current simultaneous events that are placed.
 * @param eventsBlockedChain List of chains with simultaneous events that have to be placed.
 * @param position The position where the event has to be placed.
 * @returns If an event has been able to be placed.
 */
function placeEvents(
  events: Array<EventCalendarItem>,
  chain: Array<number>,
  eventsBlockedChain: Array<Array<number>>,
  position: number
): boolean {
  // If all the events have been rightfully placed, return true
  if (eventsBlockedChain.length === 0) {
    return true;
  }

  // If the first chain of events has been rightfully placed, return true
  if (eventsBlockedChain[0].length === 0) {
    return true;
  }

  let select = 0;
  let chainPlaced = false;
  let allPlaced = false;
  let newValues: { newSelect: number; chainPlaced: boolean };
  while (!allPlaced) {
    while (!chainPlaced && select < eventsBlockedChain[0].length) {
      newValues = placeChainEvent(
        events,
        chain,
        eventsBlockedChain,
        position,
        select
      );
      select = newValues.newSelect;
      chainPlaced = newValues.chainPlaced;
    }
    if (!chainPlaced) {
      return false;
    }

    // When all following events have been rightfully placed, according to simultaneous events chain, enable the end of the placement phase.
    if (
      placeEvents(events, eventsBlockedChain[1], eventsBlockedChain.slice(1), 0)
    ) {
      allPlaced = true;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * Function that will handle the placement process of the events in a day.
 * @param events List of the events.
 */
function setSameTimeEvents(
  events: Array<EventCalendarItem>,
  eventsBlockedChain: Array<Array<Array<number>>>
): void {
  const eventsData = new Array<EventDataProps>();
  for (let i = 0; i < events.length; i++) {
    events[i].placed = false;

    // Create an eventData object which will be used to treat simultaneous events.
    eventsData.push({
      key: i,
      startDate: events[i].startDate,
      endDate: events[i].endDate,
      blocked: false,
      size: 1,
      sameTimeEvent: [],
      coupleEvents: [],
    });
  }

  // Set all same time events foreach events.
  for (let i = 0; i < events.length; i++) {
    eventsData.forEach((eventData) => {
      if (sameTime(eventsData[i], eventData)) {
        eventsData[i].sameTimeEvent.push(eventData.key);
      }
    });
  }

  // Create list of couples of events that occurs in same time and store them in eventData.
  createCoupleEvents(eventsData);

  // Get couples of events with maximal events foreach event and set the size of each event with it.
  const blockedEventsChain = blockedChains(events, eventsData);
  eventsBlockedChain.push(blockedEventsChain);

  // Set the blocked attribute to true for all events that take part of a couple chain that takes all horizontal space.
  let sizeUsed: number;
  blockedEventsChain.forEach((eventChain) => {
    sizeUsed = 0;
    eventChain.forEach((eventKey) => {
      sizeUsed += events[eventKey].effectiveSize;
    });
    if (sizeUsed === events[0].globalSize) {
      eventChain.forEach((eventKey) => {
        eventsData[eventKey].blocked = true;
      });
    }
  });

  // Reajust the size of events to use all the horizontal space
  eventSizeReajust(blockedEventsChain, events, eventsData);

  // Add blanks to complete uncomplete line
  addBlankedEvents(blockedEventsChain, events);

  // Try to place the events optimally
  if (!placeEvents(events, blockedEventsChain[0], blockedEventsChain, 0)) {
    console.warn("Some events haven't been rightfully placed");
  }
}

function isInDayWeek(
  event: EventCalendarItem,
  checkstartDate: Date,
  checkEndDate: Date,
  sortEvents: Array<Array<EventCalendarItem>>
) {
  for (let i = 1; i < 7; i++) {
    checkstartDate.setDate(checkstartDate.getDate() + 1);
    checkEndDate.setDate(checkEndDate.getDate() + 1);
    if (
      (checkstartDate <= event.startDate && event.startDate < checkEndDate) ||
      (event.startDate <= checkstartDate && checkstartDate < event.endDate)
    ) {
      sortEvents[i].push({ ...event });
    }
  }
}
function isInDayMonth(
  event: EventCalendarItem,
  checkstartDate: Date,
  checkEndDate: Date,
  sortEvents: Array<Array<EventCalendarItem>>
) {
  for (let i = 1; i < numberOfDayInDateMonth(checkstartDate); i++) {
    checkstartDate.setDate(checkstartDate.getDate() + 1);
    checkEndDate.setDate(checkEndDate.getDate() + 1);
    if (
      (checkstartDate <= event.startDate && event.startDate < checkEndDate) ||
      (event.startDate <= checkstartDate && checkstartDate < event.endDate)
    ) {
      sortEvents[i].push({ ...event });
    }
  }
}

/**
 * Get the dates of each event and put them in sortEvents accordingly.
 * @param event The event.
 * @param mondayDate The date of the monday of the week.
 * @param sortEvents The container of the events of the week sorted by day
 */
function isInDay(
  event: EventCalendarItem,
  mondayDate: Date,
  sortEvents: Array<Array<EventCalendarItem>>,
  mode: 'week' | 'month'
): void {
  const checkstartDate = new Date(
    mondayDate.getFullYear(),
    mondayDate.getMonth(),
    mondayDate.getDate()
  );
  const checkEndDate = new Date(
    mondayDate.getFullYear(),
    mondayDate.getMonth(),
    mondayDate.getDate()
  );
  checkEndDate.setDate(checkEndDate.getDate() + 1);
  if (
    (checkstartDate <= event.startDate && event.startDate < checkEndDate) ||
    (event.startDate <= checkstartDate && checkstartDate < event.endDate)
  ) {
    sortEvents[0].push(event);
  }
  if (mode === 'week') {
    isInDayWeek(event, checkstartDate, checkEndDate, sortEvents);
  } else if (mode === 'month') {
    isInDayMonth(event, checkstartDate, checkEndDate, sortEvents);
  } else {
    throw new Error(`Le mode ${mode} n'existe pas pour la fonction isInDay()`);
  }
}

/**
 * Function that sorted event in days of the week.
 * @param oldSortEvents The list of events to sort.
 * @param mondayDate The date of the monday of the week.
 * @returns The list of events, sorted by day, and the list of events chains by day.
 */
function sortInWeek(
  oldSortEvents: Array<EventCalendarItem>,
  mondayDate: Date
): {
  sortEvents: Array<Array<EventCalendarItem>>;
  eventsBlockedChain: Array<Array<Array<number>>>;
} {
  const sortEvents = [];
  const eventsBlockedChain = [];
  for (let i = 0; i < 7; i++) {
    sortEvents.push(new Array<EventCalendarItem>());
  }
  oldSortEvents.forEach((event) => {
    isInDay(event, mondayDate, sortEvents, 'week');
  });

  for (let i = 0; i < 7; i++) {
    setSameTimeEvents(sortEvents[i], eventsBlockedChain);
  }
  return { sortEvents, eventsBlockedChain };
}

function sortInMonth(
  oldSortEvents: Array<EventCalendarItem>,
  startDate: Date
): {
  sortEvents: Array<Array<EventCalendarItem>>;
} {
  const sortEvents = [];
  const eventsBlockedChain = [];
  for (let i = 0; i < numberOfDayInDateMonth(startDate); i++) {
    sortEvents.push(new Array<EventCalendarItem>());
  }
  oldSortEvents.forEach((event) => {
    isInDay(event, startDate, sortEvents, 'month');
  });

  for (let i = 0; i < 7; i++) {
    setSameTimeEvents(sortEvents[i], eventsBlockedChain);
  }
  return { sortEvents };
}

/**
 * Convert an EventCalendarItem in a type that can be exported in ics.
 * @param event An event to import.
 * @returns An event in EventAttributes type.
 */
function addEventICS(event: EventCalendarItem): EventAttributes {
  const duration = Math.floor(
    (event.endDate.getTime() - event.startDate.getTime()) / 60000
  );
  const eventCalendar: EventAttributes = {
    start: [
      event.startDate.getFullYear(),
      event.startDate.getMonth() + 1,
      event.startDate.getDate(),
      event.startDate.getHours(),
      event.startDate.getMinutes(),
    ],
    duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
    title: event.title,
    description: event.description,
    location: event.location,
    organizer: { name: event.group.name },
  };

  return eventCalendar;
}

/**
 * Function which imports the events in an ics file.
 * @param events The list of events to import.
 */
async function callICS(events: Array<EventCalendarItem>): Promise<void> {
  const filename = 'EventCalendar.ics';
  const eventsCalendar: Array<EventAttributes> = [];
  events.forEach((event) => {
    eventsCalendar.push(addEventICS(event));
  });
  const file: File = await new Promise((resolve, reject) => {
    createEvents(eventsCalendar, (error, value) => {
      if (error) {
        reject(error);
      }

      resolve(new File([value], filename, { type: 'plain/text' }));
    });
  });
  const url = URL.createObjectURL(file);

  // trying to assign the file URL to a window could cause cross-site
  // issues so this is a workaround using HTML5
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

/**
 * Change the display to the format asked.
 * @param display The type of display.
 * @param startDate The first day of the display.
 * @param updateBegin The callback to update the first day of the display.
 * @param updateEnd The callback to update the last day of the display.
 */
function changeDisplay(
  display: CalendarView,
  startDate: Date,
  updateBegin: React.Dispatch<React.SetStateAction<Date>>,
  updateEnd: React.Dispatch<React.SetStateAction<Date>>
): void {
  const newstartDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const newEndDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  switch (display) {
    case 'day':
      newEndDate.setDate(startDate.getDate() + 1);
      updateEnd(newEndDate);
      break;
    case '3Days':
      newEndDate.setDate(startDate.getDate() + 3);
      updateEnd(newEndDate);
      break;
    case 'week':
      newstartDate.setDate(
        newstartDate.getDate() - modulo(newstartDate.getDay() - 1, 7)
      );
      newEndDate.setFullYear(newstartDate.getFullYear());
      newEndDate.setMonth(newstartDate.getMonth());
      newEndDate.setDate(newstartDate.getDate() + 7);
      updateBegin(newstartDate);
      updateEnd(newEndDate);
      break;
    case 'month':
      newstartDate.setDate(1);
      newEndDate.setDate(numberOfDayInDateMonth(newstartDate) + 1);
      updateBegin(newstartDate);
      updateEnd(newEndDate);
      break;
    default:
      throw new Error(`Given display ${display} not implemented`);
  }
}

function updateWeekToDisplay(
  displayData: {
    type: CalendarView;
    startDate: number;
  },
  beginOfWeek: Date,
  endOfWeek: Date
): Array<Array<[string, number]>> | Array<Date> {
  const week: Array<[string, number]> = [
    ['Lundi', 1],
    ['Mardi', 2],
    ['Mercredi', 3],
    ['Jeudi', 4],
    ['Vendredi', 5],
    ['Samedi', 6],
    ['Dimanche', 7],
  ];
  let displaySize: Array<Array<[string, number]>> | Array<Date>;

  const date = new Date(
    beginOfWeek.getFullYear(),
    beginOfWeek.getMonth(),
    beginOfWeek.getDate()
  );
  displaySize = [new Date(date)];
  switch (displayData.type) {
    case 'day':
      break;
    case '3Days':
      for (let i = 1; i < 3; i++) {
        date.setDate(date.getDate() + 1);
        displaySize.push(new Date(date));
      }
      break;
    case 'week':
      for (let i = 1; i < 7; i++) {
        date.setDate(date.getDate() + 1);
        displaySize.push(new Date(date));
      }
      break;
    case 'month':
      if (beginOfWeek.getDate() === 1 && endOfWeek.getDate() === 1) {
        displaySize = [week.slice(modulo(beginOfWeek.getDay() - 1, 7))];
        for (
          let i = 1;
          i <
          (modulo(beginOfWeek.getDay() - 1, 7) +
            numberOfDayInDateMonth(beginOfWeek) -
            6) /
            7;
          i++
        ) {
          displaySize.push(week.slice());
        }
        if (endOfWeek.getDay() !== 1) {
          displaySize.push(week.slice(0, modulo(endOfWeek.getDay() - 1, 7)));
        }
      }
      break;
    default:
      throw new Error(`Given display ${displayData.type} not implemented`);
  }
  return displaySize;
}

/**
 * The calendar component which will contains all the day and events components.
 * @param event The list of events.
 * @returns The calendar component.
 */
function Calendar(props: {
  events: Array<EventCalendarItem>;
  onChangeRange: (period: { from: Date; to: Date }) => void;
}): JSX.Element {
  const { events, onChangeRange: onChangePeriod } = props;
  const { t } = useTranslation();
  const [displayData, updateDisplay] = useState<{
    type: CalendarView;
    startDate: number;
  }>({
    type: 'week',
    startDate: 0,
  });

  // Resize events duration to have a better display in calendar
  events.forEach((event) => {
    if (
      event.endDate.getDate() === event.startDate.getDate() &&
      event.endDate.getMonth() === event.startDate.getMonth() &&
      event.endDate.getFullYear() === event.startDate.getFullYear() &&
      event.endDate.getTime() - event.startDate.getTime() < 60 * 60 * 1000
    ) {
      if (event.startDate.getHours() < 23) {
        event.endDate = new Date(event.startDate.getTime() + 60 * 60 * 1000);
      } else {
        event.endDate.setHours(23);
        event.endDate.setMinutes(59);
        event.endDate.setSeconds(59);
      }
    } else if (event.endDate.getHours() < 1) {
      event.endDate.setHours(1);
      event.endDate.setMinutes(0);
      event.endDate.setSeconds(0);
    }
  });

  const tempMondayOfTheWeek = new Date();
  tempMondayOfTheWeek.setDate(
    tempMondayOfTheWeek.getDate() - ((tempMondayOfTheWeek.getDay() - 1) % 7)
  );

  const tempEndSundayOfTheWeek = new Date(
    tempMondayOfTheWeek.getFullYear(),
    tempMondayOfTheWeek.getMonth(),
    tempMondayOfTheWeek.getDate()
  );
  tempEndSundayOfTheWeek.setDate(tempEndSundayOfTheWeek.getDate() + 7);

  const [beginOfWeek, setBeginOfWeek] = useState(
    new Date(
      tempMondayOfTheWeek.getFullYear(),
      tempMondayOfTheWeek.getMonth(),
      tempMondayOfTheWeek.getDate()
    )
  );
  const [endOfWeek, setEndOfWeek] = useState(
    new Date(
      tempEndSundayOfTheWeek.getFullYear(),
      tempEndSundayOfTheWeek.getMonth(),
      tempEndSundayOfTheWeek.getDate()
    )
  );

  const sortEvents: Array<EventCalendarItem> = getEventWithDate(
    events,
    beginOfWeek,
    endOfWeek
  );

  let eventsWeek: {
    sortEvents: Array<Array<EventCalendarItem>>;
    eventsBlockedChain?: Array<Array<Array<number>>>;
  };
  let eventsBlockedChain: Array<Array<Array<number>>>;

  if (displayData.type !== 'month') {
    eventsWeek = sortInWeek(sortEvents, beginOfWeek);
    ({ eventsBlockedChain } = eventsWeek);
  } else {
    eventsWeek = sortInMonth(sortEvents, beginOfWeek);
  }

  const newSortEvents = eventsWeek.sortEvents;
  // In month view, the display size is composed of multiples weeks, so there ara arrays of days
  const displaySize = updateWeekToDisplay(displayData, beginOfWeek, endOfWeek);

  // Update the display and the view
  useEffect(() => {
    changeDisplay(displayData.type, beginOfWeek, setBeginOfWeek, setEndOfWeek);
  }, [displayData]);

  useEffect(() => {
    onChangePeriod({ from: beginOfWeek, to: endOfWeek });
  }, [beginOfWeek, endOfWeek]);
  return (
    <>
      <ChooseWeek
        key="ChooseWeekComponent"
        step={displayData}
        updateDisplay={updateDisplay}
        startDate={beginOfWeek}
        endDate={endOfWeek}
        updateBegin={setBeginOfWeek}
        updateEnd={setEndOfWeek}
      ></ChooseWeek>
      <ChooseDisplay
        display={displayData}
        updateDisplay={updateDisplay}
        startDate={beginOfWeek}
      ></ChooseDisplay>
      <div id="Calendar" style={{ display: 'flex' }}>
        {displayData.type !== 'month' ? (
          <Grid container spacing={0}>
            <Grid item xs={2} sm={1}>
              <DayInfos />
            </Grid>
            {displaySize.map((day, number: number) => {
              return (
                <Grid
                  item
                  xs={9.5 / displaySize.length}
                  sm={10.5 / displaySize.length}
                  key={`dayGrid${day.toISOString()}`}
                >
                  <Day
                    key={`day${day.toISOString()}`}
                    day={day}
                    events={newSortEvents[number]}
                    chains={eventsBlockedChain[number]}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Grid container spacing={0}>
            {beginOfWeek.getDate() === 1 && endOfWeek.getDate() === 1 ? (
              <Grid item xs={12}>
                <Month monthWeeks={displaySize} events={newSortEvents} />
              </Grid>
            ) : (
              <Grid item xs={12}></Grid>
            )}
          </Grid>
        )}
      </div>
      <div id="ics">
        <Button
          variant="outlined"
          onClick={() => {
            callICS(sortEvents);
          }}
        >
          {t('calendar.export')}
        </Button>
      </div>
    </>
  );
}

export default Calendar;