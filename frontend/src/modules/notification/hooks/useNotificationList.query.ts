import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import {
  NotificationListQueryParams,
  getNotificationListApi,
} from '../api/getNotificationList.api';
import { SentNotification } from '../notification.types';

export function useNotificationListQuery(
  filters: Omit<NotificationListQueryParams, 'page'>,
  {
    onSuccess,
    ...options
  }: UseInfiniteQueryOptions<Page<SentNotification>> = {}
) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<Page<SentNotification>, ApiError>({
    queryKey: ['notifications', 'list', filters],
    queryFn: ({ pageParam = 1, signal }) =>
      getNotificationListApi(
        {
          ...filters,
          page: pageParam,
        },
        signal
      ),
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
    onSuccess: (data) => {
      // update the count
      queryClient.setQueriesData(
        [
          'notifications',
          'count',
          { subscribed: filters.subscribed, seen: filters.seen },
        ],
        (prevCount: number) => data?.pages.at(-1)?.count || prevCount
      );
      return onSuccess?.(data);
    },
    ...options,
  });

  return query;
}
