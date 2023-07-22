import { UseQueryOptions, useQuery } from 'react-query';

import { getEventDetails } from '#modules/event/api/getEventDetails';
import { Event } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';

export function useEventDetailsQuery(
  eventId: number,
  options?: UseQueryOptions<Event>
) {
  const { data, ...rest } = useQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () => getEventDetails(eventId),
    ...options,
  });

  return {
    event: data,
    ...rest,
  };
}
