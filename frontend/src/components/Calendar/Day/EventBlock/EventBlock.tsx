import React from 'react';
import { CardActionArea, CardContent, CardMedia, Paper } from '@mui/material';
import { EventProps } from '../../../../Props/Event';
import './EventBlock.scss';

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
  let todayBegin = false;
  let startTime = 24;

  // Set the time when the event begins in the day.
  if (event.beginDate.getDay() === day % 7) {
    todayBegin = true;
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

  // Set the duration of the event.
  let duration: number;
  if (todayBegin) {
    duration = (event.endDate.getTime() - event.beginDate.getTime()) / 3600000;
  } else if (event.endDate.getDay() === day % 7) {
    duration =
      event.endDate.getHours() +
      event.endDate.getMinutes() / 60 +
      event.endDate.getSeconds() / 3600;
  } else {
    duration = 24;
  }

  const blockDisplayUnit = Math.min(duration, startTime);
  const minimalDisplayUnit = 2;
  if (blockDisplayUnit < minimalDisplayUnit) {
    return (
      <CardActionArea disableRipple sx={{ fontSize: '1rem' }}>
        <CardContent sx={{ padding: 0 }}>
          <Paper
            className="paperOnlyEventBlock"
            sx={{
              backgroundColor: 'red',
            }}
            style={{
              padding: `${(blockDisplayUnit - 1) * 10}px`,
              height: `${blockDisplayUnit * 20}px`,
            }}
          >
            {event.title}
          </Paper>
        </CardContent>
      </CardActionArea>
    );
  }
  return (
    <CardActionArea disableRipple sx={{ fontSize: '1rem' }}>
      <CardContent sx={{ padding: 0 }}>
        <CardMedia
          className="cardEventBlock"
          component="img"
          image={event.image}
          alt="Loading"
          style={{
            height: `${
              Math.max(blockDisplayUnit, 20) === 20
                ? (blockDisplayUnit - 1) * 20
                : blockDisplayUnit * 19
            }px`,
          }}
        />
        <Paper
          className="paperEventBlock"
          sx={{
            backgroundColor: 'red',
          }}
          style={{
            height: `${Math.max(blockDisplayUnit, 20)}px`,
          }}
        >
          {event.title}
        </Paper>
      </CardContent>
    </CardActionArea>
  );
}
