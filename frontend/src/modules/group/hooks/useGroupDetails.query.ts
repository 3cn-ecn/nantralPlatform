import { useQuery } from '@tanstack/react-query';

import { getGroupDetailsApi } from '../api/getGroupDetails.api';

export function useGroupDetailsQuery(slug: string) {
  const { data, ...rest } = useQuery(['group', slug], () =>
    getGroupDetailsApi(slug),
  );

  return { group: data, ...rest };
}
