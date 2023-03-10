import React from 'react';
import { CalendarMonth } from '@mui/icons-material';
import { Button } from '@mui/material';

/**
 * The DateBox component which displays the current week and allow to change by click.
 * @param date The first day of the week.
 * @param endDate The last day of the week.
 */
export function DateBox(props: { date: Date; endDate: Date }): JSX.Element {
  const { date, endDate } = props;
  const sunday = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  sunday.setDate(sunday.getDate() - 1);
  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          console.log('tap');
        }}
        data-testid="DateBoxTestId"
      >
        {`${date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} au `}
        {sunday.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        <CalendarMonth></CalendarMonth>
      </Button>
    </div>
  );
}
