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
      InfiniteData<Page<SentNotification>, number>,
      QueryKey,
      number
    >
  > = {},
) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    Page<SentNotification>,
    ApiError,
    InfiniteData<Page<SentNotification>, number>,
    QueryKey,
    number
  >({
    initialPageParam: 1,
    queryKey: ['notifications', 'list', filters],
    queryFn: ({ pageParam, signal }) =>
      getNotificationListApi(
        {
          ...filters,
          page: pageParam,
        },
        signal,
      ).then((data) => {
        // update the count
        queryClient.setQueriesData(
          {
            queryKey: [
              'notifications',
              'count',
              { subscribed: filters.subscribed, seen: filters.seen },
            ],
          },
          (prevCount: number) => data.count || prevCount,
        );
        return data;
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : null,
    ...options,
  });

  return query;
}
