import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  GetEventListApiParams,
  getNantralPayEventListApi,
} from '#modules/nantralpay/api/getNantralPayEventList.api';
import { NantralPayEvent } from '#modules/nantralpay/types/nantralpayEvent.type';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useNantralPayEventListQuery(
  queryParams: Omit<GetEventListApiParams, 'page'>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<NantralPayEvent>, ApiError>({
    queryKey: ['np_events', queryParams, { page }],
    queryFn: () =>
      getNantralPayEventListApi({
        page: page,
        ...queryParams,
      }),
  });

  return {
    ...query,
    page,
    setPage,
  };
}
