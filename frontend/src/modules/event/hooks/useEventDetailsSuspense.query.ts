import {
  useSuspenseQuery,
  UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import { getEventDetailsApi } from '#modules/event/api/getEventDetails.api';
import { Event } from '#modules/event/event.type';
import { useMarkAsSeenMutation } from '#modules/notification/hooks/useMarkAsSeen.mutation';
import { ApiError } from '#shared/infra/errors';

export function useEventDetailsSuspenseQuery(
  eventId: number,
  { ...options }: Partial<UseSuspenseQueryOptions<Event>> = {},
) {
  const { markAsSeen } = useMarkAsSeenMutation();

  const query = useSuspenseQuery<Event, ApiError>({
    queryKey: ['event', { id: eventId }],
    queryFn: () =>
      getEventDetailsApi(eventId).then((data) => {
        if (data.notificationId)
          markAsSeen({ notificationId: data.notificationId });
        return data;
      }),
    ...options,
  });

  return query;
}
