import React from 'react';
import { EventProps } from 'Props/Event';
import { Box } from '@mui/material';

export function DayBlock(props: {
  day: { day: number; date: number; events: Array<EventProps> } | null;
  inMonth: boolean;
}): JSX.Element {
  const { day, inMonth } = props;
  return (
    <Box
      sx={{
        backgroundColor: 'primary.dark',
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    >
      {inMonth ? null : day.date}
    </Box>
  );
}
