import { useQuery } from '@tanstack/react-query';

import { getGroupDetailsApi } from '../api/getGroupDetails.api';

export function useGroupDetailsQuery(slug: string, version?: number) {
  const { data, ...rest } = useQuery(
    version ? ['group', slug, version] : ['group', slug],
    () => getGroupDetailsApi(slug, version),
  );

  return { group: data, ...rest };
}
