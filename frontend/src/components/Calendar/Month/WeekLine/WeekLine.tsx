import React from 'react';
import { Grid } from '@mui/material';
import { EventProps } from 'Props/Event';
import { DayBlock } from './DayBlock/DayBlock';

export function WeekLine(props: {
  week: Array<{ day: number; date: number; events: Array<EventProps> }>;
}): JSX.Element {
  const { week } = props;
  const weekComponent: Array<JSX.Element> = [];
  if (week.length === 7) {
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item xs={12 / 7}>
            <DayBlock key={`day${day.day}`} day={day} inMonth></DayBlock>
          </Grid>
        );
      }
    );
  } else if (week[0].date === 1) {
    for (let i = 0; i < 7 - week.length; i++) {
      weekComponent.push(
        <Grid item xs={12 / 7}>
          <DayBlock
            key={`day${i - (7 - week.length)}`}
            day={null}
            inMonth={false}
          ></DayBlock>
        </Grid>
      );
    }
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item xs={12 / 7}>
            <DayBlock key={`day${day.day}`} day={day} inMonth></DayBlock>
          </Grid>
        );
      }
    );
  } else {
    week.forEach(
      (day: { day: number; date: number; events: Array<EventProps> }) => {
        weekComponent.push(
          <Grid item xs={12 / 7}>
            <DayBlock key={`day${day.day}`} day={day} inMonth></DayBlock>
          </Grid>
        );
      }
    );
    for (let i = 0; i < 7 - week.length; i++) {
      weekComponent.push(
        <Grid item xs={12 / 7}>
          <DayBlock
            key={`day${i - week.length}`}
            day={null}
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
