import { useMemo } from 'react';

import {
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
} from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { useFilters } from '#pages/Event/hooks/useFilters';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarViewMode } from '../EventCalendar/types';

export function useCalendarFilters() {
  const { startOfWeek, endOfWeek } = useTranslation();
  const [rawFilters, updateFilters, resetFilters] = useFilters();

  const [viewMode, filters] = useMemo<
    [CalendarViewMode, EventListQueryParams & { fromDate: Date; toDate: Date }]
  >(() => {
    const { fromDate, toDate } = rawFilters;
    // if no date params, force current week
    if (!fromDate || !toDate) {
      const now = new Date();
      return [
        'days',
        {
          ...rawFilters,
          fromDate: startOfWeek(now),
          toDate: endOfWeek(now),
        },
      ];
    }
    // if more than 20 days, force month view
    if (differenceInCalendarDays(toDate, fromDate) > 20) {
      return [
        'month',
        {
          ...rawFilters,
          fromDate: startOfMonth(fromDate),
          toDate: endOfMonth(fromDate),
        },
      ];
    }
    // else use days view
    return [
      'days',
      {
        ...rawFilters,
        fromDate: startOfDay(fromDate),
        toDate: endOfDay(toDate),
      },
    ];
  }, [rawFilters, endOfWeek, startOfWeek]);

  return [filters, updateFilters, resetFilters, viewMode] as const;
}
