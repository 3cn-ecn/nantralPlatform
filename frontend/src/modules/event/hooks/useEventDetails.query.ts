import { UseQueryOptions, useQuery } from 'react-query';

import { getEventDetailsApi } from '#modules/event/api/getEventDetails.api';
import { Event } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';

export function useEventDetailsQuery(
  eventId: number,
  options?: UseQueryOptions<Event>
) {
  const query = useQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () => getEventDetailsApi(eventId),
    ...options,
  });

  return query;
}
