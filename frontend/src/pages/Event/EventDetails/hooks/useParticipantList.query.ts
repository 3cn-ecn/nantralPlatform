import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { getParticipantList } from '#modules/event/api/getParticipantList';
import { StudentPreview } from '#modules/student/student.types';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useParticipantList(
  eventId: number,
  options?: UseQueryOptions<Page<StudentPreview>>
) {
  const [page, setPage] = useState(1);

  const { data, ...rest } = useQuery<Page<StudentPreview>, ApiError>({
    queryKey: ['event', { id: eventId }, 'participants', page],
    queryFn: () =>
      getParticipantList(eventId, {
        page: page,
        pageSize: 100,
      }),
    ...options,
  });

  return {
    participants: data && data.results,
    numberOfParticipants: data && data.count,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
