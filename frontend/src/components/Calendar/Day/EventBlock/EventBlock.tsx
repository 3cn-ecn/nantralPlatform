import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EventProps } from '../../../../Props/Event';
import './EventBlock.scss';

/**
 * The EventBlock component, which is an event in the calendar display.
 * @param day The date of the event.
 * @param event The event object with the event data.
 * @returns The button to display, already placed and resized.
 */
export function EventBlock(props: {
  day: Date;
  event: EventProps;
}): JSX.Element {
  const { day, event } = props;
  let todayBegin = false;
  let startTime = 24;

  // Set the time when the event begins in the day.
  if (
    event.beginDate.getDate() === day.getDate() &&
    event.beginDate.getMonth() === day.getMonth() &&
    event.beginDate.getFullYear() === day.getFullYear()
  ) {
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
  } else if (
    event.endDate.getDate() === day.getDate() &&
    event.endDate.getMonth() === day.getMonth() &&
    event.endDate.getFullYear() === day.getFullYear()
  ) {
    duration =
      event.endDate.getHours() +
      event.endDate.getMinutes() / 60 +
      event.endDate.getSeconds() / 3600;
  } else {
    duration = 24;
  }

  const navigate = useNavigate();
  const size = Math.min(duration, startTime);
  return (
    <Button
      className="eventButton"
      variant="contained"
      fullWidth
      onClick={() => {
        navigate(`/event/${event.id}/`);
      }}
      style={{
        minWidth: `1px`,
        height: `${size * 1.2}rem`,
        padding: '0px',
        background: `url(${event.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        verticalAlign: 'top',
        textTransform: 'none',
      }}
    >
      <div className="imageEventBlur">
        <div
          className="eventBlockTitleDisplay"
          style={{
            WebkitLineClamp: size < 2 ? 1 : Math.floor(size * 0.8),
          }}
        >
          {size >= 1 ? event.title : ''}
        </div>
      </div>
    </Button>
  );
}
