import { useState } from 'react';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import {
  EventListQueryParams,
  getEventListApi,
} from '#modules/event/api/getEventList.api';
import { EventPreview } from '#modules/event/event.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useEventListQuery(
  queryParams: Omit<EventListQueryParams, 'page'>,
  options?: UseQueryOptions<Page<EventPreview>>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<EventPreview>, ApiError>({
    queryKey: ['events', queryParams, { page }],
    queryFn: ({ signal }) =>
      getEventListApi(
        {
          page: page,
          ...queryParams,
        },
        signal,
      ),
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
  };
}
