import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';

import {
  getNotificationCountApi,
  NotificationCountQueryParams,
} from '../api/getNotificationCount.api';

export function useNotificationCountQuery(
  filters: Omit<NotificationCountQueryParams, 'page'>,
  options?: Partial<UseQueryOptions<number, ApiError>>,
) {
  const query = useQuery<number, ApiError>({
    queryKey: ['notifications', 'count', filters],
    queryFn: () =>
      getNotificationCountApi({
        ...filters,
      }),
    ...options,
  });

  return query;
}
