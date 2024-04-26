import { useQuery } from '@tanstack/react-query';

import { getGroupTypeDetailsApi } from '#modules/group/api/getGroupTypeDetails.api';
import { useAuth } from '#shared/context/Auth.context';

export function useGroupTypeDetails(type?: string) {
  const { isAuthenticated } = useAuth();
  const { data: groupType } = useQuery({
    queryFn: () => getGroupTypeDetailsApi(type || ''),
    queryKey: ['getGroupTypeDetails', type, isAuthenticated],
  });
  return groupType;
}
