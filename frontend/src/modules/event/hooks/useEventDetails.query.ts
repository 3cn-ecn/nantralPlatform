import {
  useQuery,
  UseQueryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import { getEventDetailsApi } from '#modules/event/api/getEventDetails.api';
import { Event } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';

export function useEventDetailsQuery(
  eventId: number,
  options?: Partial<UseQueryOptions<Event, ApiError>>,
) {
  return useQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () => getEventDetailsApi(eventId),
    ...options,
  });
}

export function useSuspenseEventDetailsQuery(
  eventId: number,
  options?: Partial<UseSuspenseQueryOptions<Event, ApiError>>,
) {
  return useSuspenseQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () => getEventDetailsApi(eventId),
    ...options,
  });
}
