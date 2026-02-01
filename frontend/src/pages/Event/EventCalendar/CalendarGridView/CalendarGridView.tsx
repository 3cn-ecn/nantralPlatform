import { Box, Typography, useTheme } from '@mui/material';
import {
  areIntervalsOverlapping,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  getDate,
  getWeekOfMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { upperFirst } from 'lodash-es';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useEventListQuery } from '../../hooks/useEventList.query';
import { createBlankEvents } from '../shared/createBlankEvents';
import { CalendarEventBlock } from './CalendarEventBlock';
import { CalendarEventBlockSkeleton } from './CalendarEventBlockSkeleton';

interface CalendarGridViewProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
}

export function CalendarGridView({ filters }: CalendarGridViewProps) {
  const { formatDate, startOfWeek, endOfWeek, dateFnsLocale } =
    useTranslation();
  const theme = useTheme();
  const eventsQuery = useEventListQuery({ ...filters, pageSize: 200 });

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

  const weekDays = eachDayOfInterval({
    start: startOfWeek(filters.fromDate),
    end: endOfWeek(filters.fromDate),
  }).map((date) => upperFirst(formatDate(date, { weekday: 'short' })));

  const daysOfMonth = eachDayOfInterval({
    start: filters.fromDate,
    end: filters.toDate,
  });

  const colOfFirstDay =
    differenceInCalendarDays(filters.fromDate, startOfWeek(filters.fromDate)) +
    1;

  const isEvenWeek = (date: Date) =>
    getWeekOfMonth(date, { locale: dateFnsLocale }) % 2;

  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
      overflow="auto"
      minWidth="100%"
    >
      {weekDays.map((weekDay) => (
        <Typography
          key={weekDay}
          textAlign="center"
          variant="caption"
          color="text.secondary"
          noWrap
        >
          {weekDay}
        </Typography>
      ))}
      {daysOfMonth.map((date, i) => (
        <Box
          key={date.toISOString()}
          sx={{
            ...(i === 0 ? { gridColumn: colOfFirstDay } : {}),
            minWidth: '5rem',
            minHeight: '7rem',
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.grey[isEvenWeek(date) ? 100 : 50]
                : theme.palette.grey[isEvenWeek(date) ? 800 : 900],
            borderRight: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            ...(getDate(date) < 8
              ? { borderTop: `1px solid ${theme.palette.divider}` }
              : {}),
            ...(isSameDay(startOfWeek(date), date) ||
            isSameDay(startOfMonth(date), date)
              ? { borderLeft: `1px solid ${theme.palette.divider}` }
              : {}),
          }}
        >
          <Typography textAlign="center" py={1}>
            {formatDate(date, { day: 'numeric' })}
          </Typography>
          {events
            .filter((e) =>
              areIntervalsOverlapping(
                { start: startOfDay(date), end: endOfDay(date) },
                { start: e.startDate, end: e.endDate },
              ),
            )
            .map((event) =>
              eventsQuery.isPending ? (
                <CalendarEventBlockSkeleton key={event.id} />
              ) : (
                <CalendarEventBlock key={event.id} eventItem={event} />
              ),
            )}
        </Box>
      ))}
    </Box>
  );
}
