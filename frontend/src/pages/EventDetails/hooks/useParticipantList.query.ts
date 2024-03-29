import { useState } from 'react';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getParticipantListApi } from '#modules/event/api/getParticipantList.api';
import { StudentPreview } from '#modules/student/student.types';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useParticipantList(
  eventId: number,
  options?: UseQueryOptions<Page<StudentPreview>>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<StudentPreview>, ApiError>({
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
