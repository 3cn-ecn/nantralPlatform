import { Grid } from '@mui/material';
import { EventProps } from 'Props/Event';
import React from 'react';
import { Day } from './Day/Day';

export function DayRenderer(props: {
  display: { type: 'day' | '3Day' | 'week' | 'month'; beginDate: number };
  eventsList: Array<Array<EventProps>>;
  chainsList: Array<Array<Array<number>>>;
}): Array<JSX.Element> {
  const { display, eventsList, chainsList } = props;

  const week = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche',
  ];

  let displaySize;
  switch (display.type) {
    case 'day':
      displaySize = week.slice((display.beginDate - 1) % 7, display.beginDate);
      return displaySize.map((day, number) => {
        return (
          <Grid item xs={1.5} key={day}>
            <Day
              key={day}
              dayValue={number + 1}
              day={day}
              events={eventsList[number]}
              chains={chainsList[number]}
            />
          </Grid>
        );
      });
    case '3Day':
      displaySize = week.slice(
        (display.beginDate - 1) % 7,
        Math.max(6, (display.beginDate + 2) % 7)
      );
      if (display.beginDate + 2 > 6) {
        displaySize.concat(week.slice(0, display.beginDate + (2 % 7)));
      }
      return displaySize.map((day, number) => {
        return (
          <Grid item xs={1.5} key={day}>
            <Day
              key={day}
              dayValue={number + 1}
              day={day}
              events={eventsList[number]}
              chains={chainsList[number]}
            />
          </Grid>
        );
      });
    case 'week':
      return week.map((day, number) => {
        return (
          <Grid item xs={1.5} key={day}>
            <Day
              key={day}
              dayValue={number + 1}
              day={day}
              events={eventsList[number]}
              chains={chainsList[number]}
            />
          </Grid>
        );
      });
    default:
  }
}
