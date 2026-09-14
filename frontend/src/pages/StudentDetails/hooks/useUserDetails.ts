import { useQuery } from '@tanstack/react-query';

import { getCurrentUserApi } from '#modules/account/api/getCurrentUser.api';
import { getUserDetailsApi } from '#modules/account/api/getUserDetails.api';

export function useUserDetails(id: 'me' | number | undefined) {
  const query = useQuery({
    queryFn: ({ signal }) =>
      id === 'me'
        ? getCurrentUserApi({ signal })
        : getUserDetailsApi({ id: id || -1 }),
    queryKey: ['user', { id }],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
