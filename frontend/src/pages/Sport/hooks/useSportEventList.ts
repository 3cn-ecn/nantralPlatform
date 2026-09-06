import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getSportEventsApi,
  SportEventsQueryParameters,
} from '#modules/event/api/getSportEvents.api';
import { SportEvent } from '#modules/event/sportevent.type';

import { getSportEventGroupKey, LATER_GROUP_KEY } from './useDayDisplay';

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
    const groupKey = getSportEventGroupKey(sportEvent.date);
    if (groupByDay.has(groupKey)) {
      groupByDay.get(groupKey)?.push(sportEvent);
    } else {
      groupByDay.set(groupKey, [sportEvent]);
    }
  });

  // the "later" row always shows, even with no events, so it can host
  // the permanent create-event card
  if (!groupByDay.has(LATER_GROUP_KEY)) {
    groupByDay.set(LATER_GROUP_KEY, []);
  }

  return {
    query: query,
    groupByDay,
    count: query.data?.pages[0].count,
  };
}
