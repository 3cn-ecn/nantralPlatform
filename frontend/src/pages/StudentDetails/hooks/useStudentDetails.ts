import { useQuery } from '@tanstack/react-query';

import { getCurrentUserApi } from '#modules/student/api/getCurrentUser.api';
import { getStudentDetailsApi } from '#modules/student/api/getStudentDetails.api';

export function useStudentDetails(id: string | undefined) {
  const parsedId = id ? Number.parseInt(id) : undefined;

  const query = useQuery({
    queryFn: ({ signal }) =>
      id === 'me'
        ? getCurrentUserApi({ signal })
        : getStudentDetailsApi({ id: parsedId || -1 }),
    queryKey: ['student', { id }],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
