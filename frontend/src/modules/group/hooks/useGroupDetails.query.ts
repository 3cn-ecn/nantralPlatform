import { useQuery } from '@tanstack/react-query';

import { getGroupDetailsApi } from '../api/getGroupDetails.api';

export function useGroupDetailsQuery(slug: string, version?: number) {
  const { data, ...rest } = useQuery({
    queryKey: version ? ['group', slug, version] : ['group', slug],
    queryFn: () => getGroupDetailsApi(slug, version),
  });

  return { group: data, ...rest };
}
