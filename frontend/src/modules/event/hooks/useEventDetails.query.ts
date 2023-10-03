import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getEventDetailsApi } from '#modules/event/api/getEventDetails.api';
import { Event } from '#modules/event/event.type';
import { useMarkAsSeenMutation } from '#modules/notification/hooks/useMarkAsSeen.mutation';
import { ApiError } from '#shared/infra/errors';

export function useEventDetailsQuery(
  eventId: number,
  { onSuccess, ...options }: UseQueryOptions<Event> = {}
) {
  const { markAsSeen } = useMarkAsSeenMutation();

  const query = useQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () => getEventDetailsApi(eventId),
    onSuccess: (data) => {
      if (data.notificationId)
        markAsSeen({ notificationId: data.notificationId });
      return onSuccess?.(data);
    },
    ...options,
  });

  return query;
}
