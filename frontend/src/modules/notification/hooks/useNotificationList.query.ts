import { useEffect } from 'react';

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import {
  getNotificationListApi,
  NotificationListQueryParams,
} from '../api/getNotificationList.api';
import { SentNotification } from '../notification.types';

export function useNotificationListQuery(
  filters: Omit<NotificationListQueryParams, 'page'>,
  {
    ...options
  }: Partial<
    UseInfiniteQueryOptions<
      Page<SentNotification>,
      ApiError,
      InfiniteData<Page<SentNotification>>,
      QueryKey,
      number
    >
  > = {},
) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    Page<SentNotification>,
    ApiError,
    InfiniteData<Page<SentNotification>>,
    QueryKey,
    number
  >({
    queryKey: ['notifications', 'list', filters],
    queryFn: ({ pageParam, signal }) =>
      getNotificationListApi(
        {
          ...filters,
          page: pageParam,
        },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
    ...options,
  });

  useEffect(() => {
    // update the count
    queryClient.setQueriesData(
      {
        queryKey: [
          'notifications',
          'count',
          { subscribed: filters.subscribed, seen: filters.seen },
        ],
      },
      (prevCount: number) => query.data?.pages.at(-1)?.count || prevCount,
    );
  }, [filters.seen, filters.subscribed, query.data, queryClient]);

  return query;
}
