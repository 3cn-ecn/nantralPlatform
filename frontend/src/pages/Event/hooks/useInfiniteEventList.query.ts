import {
  InfiniteData,
  QueryFunctionContext,
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
      InfiniteData<Page<EventPreview>>
    >
  >,
) {
  const query = useInfiniteQuery({
    queryKey: ['events', 'infiniteList', filters],
    queryFn: ({ pageParam, signal }: QueryFunctionContext<QueryKey, number>) =>
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
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
    ...options,
  });

  return query;
}
