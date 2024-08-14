import { useQuery } from '@tanstack/react-query';

import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';

export function useGroupTypeDetails(type?: string) {
  const groupTypeQuery = useQuery({
    queryFn: () => getGroupTypeDetailsApi(type || ''),
    queryKey: ['getGroupTypeDetails', type],
  });
  return groupTypeQuery;
}
