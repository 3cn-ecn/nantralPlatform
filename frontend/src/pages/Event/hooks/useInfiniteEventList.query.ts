import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  EventListQueryParams,
  getEventListApi,
} from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useInfiniteEventListQuery(
  filters: Omit<EventListQueryParams, 'page' | 'ordering'>,
  options?: UseInfiniteQueryOptions<Page<EventPreview>>
) {
  const query = useInfiniteQuery<Page<EventPreview>, ApiError>({
    queryKey: ['events', 'infiniteList', filters],
    queryFn: ({ pageParam = 1, signal }) =>
      getEventListApi(
        {
          ...filters,
          page: pageParam,
          ordering: filters.toDate && !filters.fromDate ? '-start_date' : null,
        },
        signal
      ),
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
    ...options,
  });

  return query;
}
