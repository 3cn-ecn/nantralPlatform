import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { getEventListApi } from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useUpcomingEventsQuery(
  numberOfEvents: number,
  options?: UseQueryOptions<Page<EventPreview>>
) {
  const [page, setPage] = useState(1);
  const now = new Date();

  const query = useQuery<Page<EventPreview>, ApiError>({
    queryKey: ['events', 'upcoming-events', page],
    queryFn: () =>
      getEventListApi({
        fromDate: now,
        page: page,
        pageSize: numberOfEvents,
      }),
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
  };
}
