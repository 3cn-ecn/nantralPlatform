import { Link } from 'react-router-dom';

import { ButtonBase, Typography, useTheme } from '@mui/material';
import {
  differenceInMilliseconds,
  hoursToMilliseconds,
  startOfDay,
} from 'date-fns';

import { stringToColor } from '#shared/utils/stringToColor';

import { CalendarEventItem } from '../types';

function toPercent(x: number) {
  return `${x * 100}%`;
}

interface CalendarEventBlockProps {
  eventItem: CalendarEventItem;
}

export function CalendarEventBlock({ eventItem }: CalendarEventBlockProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      component={Link}
      to={eventItem.data.url}
      focusRipple
      sx={{
        position: 'absolute',
        top: toPercent(
          differenceInMilliseconds(
            eventItem.start,
            startOfDay(eventItem.start),
          ) / hoursToMilliseconds(24),
        ),
        height: toPercent(
          differenceInMilliseconds(eventItem.end, eventItem.start) /
            hoursToMilliseconds(24),
        ),
        left: toPercent(eventItem.col / eventItem.nbTotCols),
        width: toPercent(1 / eventItem.nbTotCols),
        backgroundColor: stringToColor(eventItem.data.title),
        backgroundImage: `url(${eventItem.data.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          backdropFilter: 'blur(5px)',
          backgroundColor:
            theme.palette.mode === 'light' ? '#FFFFFF70' : '#00000060',
          padding: '0.2rem 0.5rem',
          borderRadius: '20px',
        }}
        textAlign="center"
        noWrap
      >
        {eventItem.data.title}
      </Typography>
    </ButtonBase>
  );
}
