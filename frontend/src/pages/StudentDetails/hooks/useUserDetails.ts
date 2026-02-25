import { useQuery } from '@tanstack/react-query';

import { getCurrentUserApi } from '#modules/account/api/getCurrentUser.api';
import { getUserDetailsApi } from '#modules/account/api/getUserDetails.api';

export function useUserDetails(id: string | undefined) {
  const parsedId = id ? Number.parseInt(id) : undefined;

  const query = useQuery({
    queryFn: ({ signal }) =>
      id === 'me'
        ? getCurrentUserApi({ signal })
        : getUserDetailsApi({ id: parsedId || -1 }),
    queryKey: ['user', { id }],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
