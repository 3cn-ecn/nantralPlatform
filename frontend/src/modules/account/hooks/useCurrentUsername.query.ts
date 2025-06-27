import { useQuery } from '@tanstack/react-query';

import getUsernameApi from '#modules/account/api/getUsername.api';
import { ApiError } from '#shared/infra/errors';

export function useCurrentUsernameQuery() {
  const query = useQuery<
    {
      username: string;
      picture: string;
      name: string;
      has_updated_username: boolean;
    },
    ApiError
  >({
    queryKey: ['username'],
    queryFn: getUsernameApi,
  });

  return query;
}
