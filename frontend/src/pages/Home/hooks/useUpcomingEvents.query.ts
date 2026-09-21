import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useUpcomingEventsQuery(
  numberOfEvents: number,
  options?: Partial<UseQueryOptions<Page<EventPreview>>>,
) {
  const now = new Date();

  const query = useQuery<Page<EventPreview>, ApiError>({
    queryKey: [
      'events',
      'upcoming-events',
      { page: 1, pageSize: numberOfEvents },
    ],
    queryFn: () =>
      getEventListApi({
        fromDate: now,
        page: 1,
        pageSize: numberOfEvents,
      }),
    ...options,
  });

  return query;
}
