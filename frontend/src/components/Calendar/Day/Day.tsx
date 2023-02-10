import React from 'react';
import { Grid } from '@mui/material';
import { EventProps } from 'pages/Props/Event';
import { EventBlock } from './EventBlock/EventBlock';
import { TimeBlock } from './TimeBlock/TimeBlock';

/**
 * Sort events according to their position.
 * @param eventKeyList The index of events to sort.
 * @param events The global list of events.
 * @returns The list of events sorted.
 */
function sortWithPos(
  eventKeyList: Array<number>,
  events: Array<EventProps>
): Array<number> {
  const eventChain = [];
  let currentSize = 0;
  let currentEvent = 0;
  const { globalSize } = events[eventKeyList[0]];
  while (currentSize !== globalSize && currentEvent < eventKeyList.length) {
    if (events[eventKeyList[currentEvent]].position === currentSize) {
      eventChain.push(eventKeyList[currentEvent]);
      currentSize += events[eventKeyList[currentEvent]].effectiveSize;
      currentEvent = 0;
    } else {
      currentEvent += 1;
    }
  }
  if (currentSize !== globalSize) {
    console.warn('Event chain is wrong');
  }
  return eventChain;
}

/**
 * The Day component which contains all the TimeBlocks and EventBlocks of this day.
 * @param dayValue The value of the day in the week.
 * @param day The day in the week.
 * @param events The list of events in corresponding day.
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
  const placing = [];
  for (let i = 0; i < events.length; i++) {
    placing.push(i);
  }

  const eventDate = [];
  let beginDate: Date;

  events.forEach((event) => {
    beginDate = new Date(event.date);
    let startTime = 24;
    if (beginDate.getDay() === dayValue % 7) {
      if (
        beginDate.getHours() !== 0 ||
        beginDate.getMinutes() !== 0 ||
        beginDate.getSeconds() !== 0
      ) {
        startTime =
          23 -
          beginDate.getHours() +
          (59 - beginDate.getMinutes()) / 60 +
          (60 - beginDate.getSeconds()) / 3600;
      }
    }
    eventDate.push(startTime);
  });

  return (
    <div id={day} style={{ display: 'block' }}>
      {day}
      {dayChain}
      {chains.map((chain, number) => (
        <Grid container key={`Chain${chain}Day${day}`}>
          {chain.map((eventKey) => {
            if (placing.includes(eventKey)) {
              placing.splice(placing.indexOf(eventKey), 1);
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

            return (
              <Grid
                item
                key={events[eventKey].slug}
                xs={
                  (events[eventKey].effectiveSize * 12) /
                  events[eventKey].globalSize
                }
                sx={{
                  height: `$1px`,
                  transform: `translate(0px, -${
                    number + 20 * eventDate[eventKey]
                  }px)`,
                }}
              ></Grid>
            );
          })}
        </Grid>
      ))}
    </div>
  );
}
