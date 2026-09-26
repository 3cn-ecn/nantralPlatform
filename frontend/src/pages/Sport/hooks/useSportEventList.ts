import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getSportEventsApi,
  SportEventsQueryParameters,
} from '#modules/event/api/getSportEvents.api';
import { SportEvent } from '#modules/event/sportevent.type';

import { getSportEventDayKey, getSportEventWeekKey } from './useDayDisplay';

export function useSportEventList(
  params?: Omit<SportEventsQueryParameters, 'page'>,
) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getSportEventsApi({
        page: pageParam,
        pageSize: 6 * 7,
        ...params,
      }),
    queryKey: ['getSportEvents', params],
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : null,
  });

  const flatResult = query.data?.pages?.flatMap((page) => page.results) ?? [];
  // events come sorted by date, so weeks and days keep their insertion order
  const groupByWeek = new Map<string, Map<string, SportEvent[]>>();

  flatResult.forEach((sportEvent: SportEvent) => {
    const weekKey = getSportEventWeekKey(sportEvent.date);
    const dayKey = getSportEventDayKey(sportEvent.date);
    let week = groupByWeek.get(weekKey);
    if (!week) {
      week = new Map();
      groupByWeek.set(weekKey, week);
    }
    const day = week.get(dayKey);
    if (day) {
      day.push(sportEvent);
    } else {
      week.set(dayKey, [sportEvent]);
    }
  });

  return {
    query: query,
    groupByWeek,
    count: query.data?.pages[0].count,
  };
}
