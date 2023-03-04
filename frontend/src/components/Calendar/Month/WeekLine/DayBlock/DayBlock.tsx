import React from 'react';
import { EventProps } from 'Props/Event';
import { Box, Button } from '@mui/material';

export function DayBlock(props: {
  day: { day: number; date: number; events: Array<EventProps> } | null;
  inMonth: boolean;
  maxEventsInDayWeek: number;
}): JSX.Element {
  const { day, inMonth, maxEventsInDayWeek } = props;
  if (inMonth) {
    return (
      <Box
        sx={{
          height: `${(maxEventsInDayWeek + 1) * 40}px`,
          border: '1px solid gray',
        }}
      >
        {day.date}
        {day.events.map((event) => {
          return (
            <Button
              key={event.slug}
              variant="contained"
              fullWidth
              onClick={() => {
                console.log(event);
              }}
              style={{
                minWidth: `1px`,
                height: `40px`,
                padding: '0px',
              }}
            >
              {event.title[0]}
            </Button>
          );
        })}
      </Box>
    );
  }
  return <div></div>;
}
