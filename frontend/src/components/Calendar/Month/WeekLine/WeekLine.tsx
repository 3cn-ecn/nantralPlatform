import React from 'react';
import { Grid } from '@mui/material';
import { EventProps } from 'Props/Event';
import { DayBlock } from './DayBlock/DayBlock';

export function WeekLine(props: {
  week: Array<{ day: number; date: number; events: Array<EventProps> }>;
}): JSX.Element {
  const { week } = props;
  const weekComponent: Array<JSX.Element> = [];
  let maxEvents = 0;
  week.forEach((day) => {
    maxEvents = Math.max(maxEvents, day.events.length);
  });

  if (week.length === 7) {
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item key={`gridDay${day.date}`} xs={12 / 7}>
            <DayBlock
              key={`day${day.date}`}
              day={day}
              maxEventsInDayWeek={maxEvents}
              inMonth
            ></DayBlock>
          </Grid>
        );
      }
    );
  } else if (week[0].date === 1) {
    for (let i = 0; i < 7 - week.length; i++) {
      weekComponent.push(
        <Grid item key={`previousDay${i - (7 - week.length)}`} xs={12 / 7}>
          <DayBlock
            key={`previousDay${i - (7 - week.length)}`}
            day={null}
            maxEventsInDayWeek={0}
            inMonth={false}
          ></DayBlock>
        </Grid>
      );
    }
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item key={`gridDay${day.date}`} xs={12 / 7}>
            <DayBlock
              key={`day${day.date}`}
              day={day}
              maxEventsInDayWeek={maxEvents}
              inMonth
            ></DayBlock>
          </Grid>
        );
      }
    );
  } else {
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item key={`gridDay${day.date}`} xs={12 / 7}>
            <DayBlock
              key={`day${day.date}`}
              day={day}
              maxEventsInDayWeek={maxEvents}
              inMonth
            ></DayBlock>
          </Grid>
        );
      }
    );
    for (let i = 0; i < 7 - week.length; i++) {
      weekComponent.push(
        <Grid item key={`gridAfterDay${i}`} xs={12 / 7}>
          <DayBlock
            key={`afterDay${i}`}
            day={null}
            maxEventsInDayWeek={0}
            inMonth={false}
          ></DayBlock>
        </Grid>
      );
    }
  }
  return (
    <Grid container spacing={0}>
      {weekComponent}
    </Grid>
  );
}
