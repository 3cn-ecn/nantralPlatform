import { Skeleton } from '@mui/material';
import {
  differenceInMilliseconds,
  hoursToMilliseconds,
  startOfDay,
} from 'date-fns';

import { CalendarEventItem } from '../types';

function toPercent(x: number) {
  return `${x * 100}%`;
}

interface CalendarEventBlockSkeletonProps {
  eventItem: CalendarEventItem;
}

export function CalendarEventBlockSkeleton({
  eventItem,
}: CalendarEventBlockSkeletonProps) {
  return (
    <Skeleton
      variant="rounded"
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
        borderRadius: '10px',
      }}
    />
  );
}
