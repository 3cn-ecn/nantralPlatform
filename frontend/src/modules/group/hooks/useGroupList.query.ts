import { useState } from 'react';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import {
  GetGroupListApiParams,
  getGroupListApi,
} from '../api/getGroupList.api';
import { GroupPreview } from '../group.type';

export function useGroupListQuery(
  filters: Omit<GetGroupListApiParams, 'page'>,
  options?: UseQueryOptions<Page<GroupPreview>>
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<GroupPreview>, ApiError>({
    queryKey: ['groups', filters, { page }],
    queryFn: () =>
      getGroupListApi({
        ...filters,
        page: page,
      }),
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
  };
}
