import { useState } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import {
  getGroupListApi,
  GetGroupListApiParams,
} from '../api/getGroupList.api';
import { GroupPreview } from '../types/group.types';

export function useGroupListQuery(
  filters: Omit<GetGroupListApiParams, 'page'>,
  options?: Partial<UseQueryOptions<Page<GroupPreview>, ApiError>>,
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
