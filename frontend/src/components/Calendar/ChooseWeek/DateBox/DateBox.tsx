import React from 'react';
import { CalendarMonth } from '@mui/icons-material';
import { Button } from '@mui/material';

export function DateBox(props: { date: Date; endDate: Date }) {
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
