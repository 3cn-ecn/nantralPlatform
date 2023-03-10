import React from 'react';
import { Grid } from '@mui/material';
import { EventProps } from '../../../Props/Event';
import { EventBlock } from './EventBlock/EventBlock';
import { TimeBlock } from './TimeBlock/TimeBlock';

/**
 * Sort events according to their position.
 * @param eventKeyList The index of events to sort.
 * @param events The global list of events.
 * @returns The list of events sorted.
 */
export function sortWithPos(
  eventKeyList: Array<number>,
  events: Array<EventProps>
): Array<number> {
  const eventChain = [];
  let currentSize = 0;
  let currentEvent = 0;
  let hasBlanked = false;
  let blankUsed = false;
  let blankedEventKey: number;
  const { globalSize } = events[eventKeyList[0]];

  while (
    currentSize !== globalSize &&
    (currentEvent < eventKeyList.length || hasBlanked)
  ) {
    if (currentEvent < eventKeyList.length) {
      // If a blanked event exist, set hasBlanked to true and get the key (= size) of the blanked event
      if (eventKeyList[currentEvent] < 0 && !blankUsed) {
        hasBlanked = true;
        blankedEventKey = currentEvent;
        currentEvent += 1;
      } else if (
        eventKeyList[currentEvent] >= 0 &&
        events[eventKeyList[currentEvent]].position === currentSize
      ) {
        eventChain.push(eventKeyList[currentEvent]);
        currentSize += events[eventKeyList[currentEvent]].effectiveSize;
        currentEvent = 0;
      } else {
        currentEvent += 1;
      }
    } else {
      // Use the blanked event if it's necessary
      eventChain.push(eventKeyList[blankedEventKey]);
      currentSize -= eventKeyList[blankedEventKey];
      currentEvent = 0;
      hasBlanked = false;
      blankUsed = true;
    }
  }
  if (currentSize !== globalSize) {
    throw new Error(`Event chain is wrong`);
  }
  return eventChain;
}

/**
 * The Day component which contains all the TimeBlocks and EventBlocks of this day.
 * @param dayValue The value of the day in the week.
 * @param day The day in the week.
 * @param events The list of events in corresponding day.
 * @param chains The list of blocked chains.
 * @returns The Day component.
 */
export function Day(props: {
  dayValue: number;
  day: string;
  events: Array<EventProps>;
  chains: Array<Array<number>>;
}): JSX.Element {
  const { dayValue, day, events, chains } = props;
  const dayChain = [];
  for (let hour = 0; hour < 24; hour++) {
    dayChain.push(<TimeBlock key={hour} startTime={hour}></TimeBlock>);
  }

  // Sort Event chains
  for (let i = 0; i < chains.length; i++) {
    chains[i] = sortWithPos(chains[i], events);
  }

  // Check whether events are already placed
  const toPlace = [];
  for (let i = 0; i < events.length; i++) {
    toPlace.push(i);
  }

  const eventDate = [];

  events.forEach((event) => {
    let startTime = 24;
    if (event.beginDate.getDay() === dayValue % 7) {
      if (
        event.beginDate.getHours() !== 0 ||
        event.beginDate.getMinutes() !== 0 ||
        event.beginDate.getSeconds() !== 0
      ) {
        startTime =
          23 -
          event.beginDate.getHours() +
          (59 - event.beginDate.getMinutes()) / 60 +
          (60 - event.beginDate.getSeconds()) / 3600;
      }
    }
    eventDate.push(startTime);
  });

  return (
    <div id={day} style={{ display: 'block' }}>
      {day}
      {dayChain}
      {chains.map((chain, number) => (
        <Grid
          container
          key={`Chain${chain}Day${day}`}
          data-testid={`GlobalDayContainer${day}TestId`}
        >
          {chain.map((eventKey) => {
            if (eventKey >= 0) {
              // If the event is not already displayed
              if (toPlace.includes(eventKey)) {
                toPlace.splice(toPlace.indexOf(eventKey), 1);
                return (
                  <Grid
                    item
                    key={events[eventKey].slug}
                    xs={
                      (events[eventKey].effectiveSize * 12) /
                      events[eventKey].globalSize
                    }
                    sx={{
                      height: `1px`,
                      transform: `translate(0px, -${
                        number + 20 * eventDate[eventKey]
                      }px)`,
                    }}
                  >
                    <EventBlock
                      key={events[eventKey].slug}
                      day={dayValue}
                      event={events[eventKey]}
                    />
                  </Grid>
                );
              }

              // If the event has already been displayed
              return (
                <Grid
                  item
                  key={events[eventKey].slug}
                  xs={
                    (events[eventKey].effectiveSize * 12) /
                    events[eventKey].globalSize
                  }
                  sx={{
                    height: `1px`,
                    transform: `translate(0px, -${
                      number + 20 * eventDate[eventKey]
                    }px)`,
                  }}
                ></Grid>
              );
            }

            // return a blanked Event
            return (
              <Grid
                item
                key={eventKey}
                xs={(-eventKey * 12) / events[0].globalSize}
                sx={{
                  height: `1px`,
                }}
              ></Grid>
            );
          })}
        </Grid>
      ))}
    </div>
  );
}
