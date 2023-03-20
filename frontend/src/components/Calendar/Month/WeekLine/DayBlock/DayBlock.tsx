import React from 'react';
import { EventProps } from 'Props/Event';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export function DayBlock(props: {
  day: { day: number; date: number; events: Array<EventProps> } | null;
  inMonth: boolean;
  maxEventsInDayWeek: number;
}): JSX.Element {
  const { day, inMonth, maxEventsInDayWeek } = props;
  const navigate = useNavigate();
  if (inMonth) {
    return (
      <Box
        sx={{
          height: `${(maxEventsInDayWeek + 0.6) * 3}rem`,
          border: '1px solid gray',
        }}
        data-testid="DateBoxTestId"
      >
        {day.date}
        {day.events.map((event) => {
          return (
            <Button
              key={event.slug}
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(`/event/${event.id}/`);
              }}
              style={{
                minWidth: `1px`,
                height: `3rem`,
                padding: '0px',
              }}
              data-testid={`${event.slug}DateBoxButtonTestId`}
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
