import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { getEventList } from '#modules/event/api/getEventList';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useUpcomingEvents(
  numberOfEvents: number,
  options?: UseQueryOptions<Page<EventPreview>>
) {
  const [page, setPage] = useState(1);
  const now = new Date();

  const { data, ...rest } = useQuery<Page<EventPreview>, ApiError>({
    queryKey: ['events', 'upcoming-events', page],
    queryFn: () =>
      getEventList({
        fromDate: now,
        page: page,
        pageSize: numberOfEvents,
      }),
    ...options,
  });

  return {
    upcomingEvents: data && data.results,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
