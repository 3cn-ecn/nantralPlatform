import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import {
  EventListQueryParams,
  getEventListApi,
} from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useInfiniteEventListQuery(
  filters: Omit<EventListQueryParams, 'page'>,
  options?: Partial<
    UseInfiniteQueryOptions<
      Page<EventPreview>,
      ApiError,
      InfiniteData<Page<EventPreview>, number>,
      QueryKey,
      number
    >
  >,
) {
  const query = useInfiniteQuery<
    Page<EventPreview>,
    ApiError,
    InfiniteData<Page<EventPreview>, number>,
    QueryKey,
    number
  >({
    initialPageParam: 1,
    queryKey: ['events', 'infiniteList', filters],
    queryFn: ({ pageParam, signal }) =>
      getEventListApi(
        {
          ...filters,
          page: pageParam,
          ordering:
            filters.toDate && !filters.fromDate
              ? '-start_date'
              : (filters.ordering as never),
        },
        signal,
      ),
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
    ...options,
  });

  return query;
}
