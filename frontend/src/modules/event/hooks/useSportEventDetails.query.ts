import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getSportEventDetailsApi } from '#modules/event/api/getSportEventDetails.api';
import { SportEvent } from '#modules/event/sportevent.type';
import { ApiError } from '#shared/infra/errors';

export function useSportEventDetailsQuery(
  sportEventId: number,
  options: Partial<UseQueryOptions<SportEvent>> = {},
) {
  return useQuery<SportEvent, ApiError>({
    queryKey: ['sport-event', { id: sportEventId }],
    queryFn: () => getSportEventDetailsApi(sportEventId),
    ...options,
  });
}
