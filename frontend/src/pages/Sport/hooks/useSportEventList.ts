import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getSportEventsApi,
  SportEventsQueryParameters,
} from '#modules/event/api/getSportEvents.api';
import { SportEvent } from '#modules/event/sportevent.type';

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
  const groupByDay = new Map<string, SportEvent[]>();

  flatResult.forEach((sportEvent: SportEvent) => {
    const dateKey = sportEvent.date.toDateString();
    if (groupByDay.has(dateKey)) {
      groupByDay.get(dateKey)?.push(sportEvent);
    } else {
      groupByDay.set(dateKey, [sportEvent]);
    }
  });

  return {
    query: query,
    groupByDay,
    count: query.data?.pages[0].count,
  };
}
