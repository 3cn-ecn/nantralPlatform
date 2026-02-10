import { useState } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { UserPreview } from '#modules/account/user.types';
import { getParticipantListApi } from '#modules/event/api/getParticipantList.api';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useParticipantList(
  eventId: number,
  options?: UseQueryOptions<Page<UserPreview>>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<UserPreview>, ApiError>({
    queryKey: ['event', { id: eventId }, 'participants', page],
    queryFn: () =>
      getParticipantListApi(eventId, {
        page: page,
        pageSize: 100,
      }),
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
  };
}
