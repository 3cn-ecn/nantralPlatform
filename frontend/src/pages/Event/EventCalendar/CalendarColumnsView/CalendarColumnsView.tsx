import { Box, Divider, Typography, useTheme } from '@mui/material';
import {
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfToday,
  formatISO,
  startOfDay,
  startOfToday,
} from 'date-fns';
import { upperFirst, zipWith } from 'lodash-es';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useEventListQuery } from '../../hooks/useEventList.query';
import { createBlankEvents } from '../shared/createBlankEvents';
import { CalendarEventItem } from '../types';
import { CalendarEventBlock } from './CalendarEventBlock';
import { CalendarEventBlockSkeleton } from './CalendarEventBlockSkeleton';
import { magicPlacement } from './magicPlacement';

function getNumberOfCols(events: CalendarEventItem[]) {
  return events.reduce((maxCol, event) => Math.max(maxCol, event.col), -1) + 1;
}

interface CalendarColumnsViewProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
}

export function CalendarColumnsView({ filters }: CalendarColumnsViewProps) {
  const { formatDate, formatTime } = useTranslation();
  const theme = useTheme();
  const eventsQuery = useEventListQuery(filters);

  if (eventsQuery.isError)
    return (
      <ErrorPageContent
        status={eventsQuery.error.status}
        errorMessage={eventsQuery.error.message}
        retryFn={eventsQuery.refetch}
      />
    );

  const events = eventsQuery.isPending
    ? createBlankEvents(filters.fromDate, filters.toDate)
    : eventsQuery.data.results;

  const hours = eachHourOfInterval(
    { start: startOfToday(), end: endOfToday() },
    { step: 3 },
  ).concat([endOfToday()]);

  const days = eachDayOfInterval({
    start: filters.fromDate,
    end: filters.toDate,
  });

  const eventsByDay = days.map((date) =>
    events.filter((e) =>
      areIntervalsOverlapping(
        { start: e.startDate, end: e.endDate },
        { start: startOfDay(date), end: endOfDay(date) },
        { inclusive: true },
      ),
    ),
  );

  const columns = zipWith(days, eventsByDay, (date, events) => ({
    date,
    events: magicPlacement(events, date).filter(
      (e) => differenceInMinutes(e.end, e.start) > 5,
    ),
  }));

  return (
    <FlexRow overflow="auto" minWidth="100%">
      <FlexCol
        justifyContent="space-between"
        paddingTop="1.5rem"
        paddingRight={1}
      >
        {hours.map((hour) => (
          <Typography
            textAlign="right"
            variant="caption"
            color="text.secondary"
            key={formatISO(hour, { representation: 'time' })}
          >
            {formatTime(hour)}
          </Typography>
        ))}
      </FlexCol>
      {columns.map((col, i) => (
        <Box
          key={col.date.toISOString()}
          sx={{
            flex: 1 + getNumberOfCols(col.events) / 3,
            minWidth: `${6 + (getNumberOfCols(col.events) - 1) * 2}rem`,
          }}
        >
          <Typography variant="body2" textAlign="center" noWrap>
            {upperFirst(
              formatDate(col.date, { weekday: 'short', day: 'numeric' }),
            )}
          </Typography>
          <FlexCol
            justifyContent="space-between"
            sx={{
              position: 'relative',
              height: '80vh',
              minHeight: '30rem',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[i % 2 ? 50 : 200]
                  : theme.palette.grey[i % 2 ? 900 : 800],
            }}
          >
            {hours.map((h) => (
              <Divider key={formatISO(h, { representation: 'time' })} />
            ))}
            {col.events.map((item) =>
              eventsQuery.isPending ? (
                <CalendarEventBlockSkeleton
                  eventItem={item}
                  key={item.data.id}
                />
              ) : (
                <CalendarEventBlock eventItem={item} key={item.data.id} />
              ),
            )}
          </FlexCol>
        </Box>
      ))}
    </FlexRow>
  );
}
