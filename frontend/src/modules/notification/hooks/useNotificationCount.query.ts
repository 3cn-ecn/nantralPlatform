import { UseQueryOptions, useQuery } from 'react-query';

import { ApiError } from '#shared/infra/errors';

import {
  NotificationCountQueryParams,
  getNotificationCountApi,
} from '../api/getNotificationCount.api';

export function useNotificationCountQuery(
  filters: Omit<NotificationCountQueryParams, 'page'>,
  options?: UseQueryOptions<number>
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
