import React from 'react';
import { Grid } from '@mui/material';
import { EventProps } from 'pages/Props/Event';
import { EventBlock } from './EventBlock/EventBlock';
import { TimeBlock } from './TimeBlock/TimeBlock';

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
  chain: Array<Array<EventProps>>;
}): JSX.Element {
  const { dayValue, day, events, chain } = props;

  const dayChain = [];
  for (let hour = 0; hour < 24; hour++) {
    dayChain.push(<TimeBlock key={hour} startTime={hour}></TimeBlock>);
  }

  return (
    <div id={day} style={{ display: 'block' }}>
      {day}
      {dayChain}
      {/* <Grid container xs={events.length !== 0 ? events[0].globalSize : 0}> */}
      <Grid container xs={12}>
        {events.map((event) => (
          <Grid
            item
            key={event.slug}
            xs={(event.effectiveSize * 12) / event.globalSize}
          >
            <EventBlock key={event.slug} day={dayValue} event={event} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
