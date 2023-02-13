import React from 'react';
import { Button } from '@mui/material';
import { EventProps } from 'Props/Event';

/**
 * The EventBlock component, which is an event in the calendar display.
 * @param day The number of the day in the week.
 * @param event The event object with the event data.
 * @returns The button to display, already placed and resized.
 */
export function EventBlock(props: {
  day: number;
  event: EventProps;
}): JSX.Element {
  const { day, event } = props;
  const beginDate = new Date(event.date);
  const endDate = new Date(event.end_date);
  let todayBegin = false;
  let startTime = 24;

  // Set the time when the event begins in the day.
  if (beginDate.getDay() === day % 7) {
    todayBegin = true;
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

  // Set the duration of the event.
  let duration: number;
  if (todayBegin) {
    duration = (endDate.getTime() - beginDate.getTime()) / 3600000;
  } else if (endDate.getDay() === day % 7) {
    duration =
      endDate.getHours() +
      endDate.getMinutes() / 60 +
      endDate.getSeconds() / 3600;
  } else {
    duration = 24;
  }
  return (
    <Button
      variant="contained"
      fullWidth
      style={{
        minWidth: `1px`,
        height: `${Math.min(duration, startTime) * 20}px`,
        padding: '0px',
      }}
    >
      {event.title[0]}
    </Button>
  );
}