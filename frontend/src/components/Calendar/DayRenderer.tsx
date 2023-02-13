import { Grid } from '@mui/material';
import { EventProps } from 'Props/Event';
import React from 'react';
import { Day } from './Day/Day';

export function DayRenderer(props: {
  display: 'day' | '3Day' | 'week' | 'month';
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

  switch (display) {
    case 'day':
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
    case '3Day':
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
