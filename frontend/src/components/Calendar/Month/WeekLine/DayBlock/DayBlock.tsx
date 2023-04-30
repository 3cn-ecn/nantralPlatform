import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import { EventProps } from '#types/Event';

import './DayBlock.scss';

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
                background: `url(${event.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                textTransform: 'none',
              }}
              data-testid={`${event.slug}DateBoxButtonTestId`}
            >
              <div className="imageMonthEventBlur">
                <div className="dayBlockTitleDisplay">{event.title}</div>
              </div>
            </Button>
          );
        })}
      </Box>
    );
  }
  return <div></div>;
}
