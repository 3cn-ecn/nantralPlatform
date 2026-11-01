import { useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '../api/getGroupList.api';

/** Whether the current user can manage the sport events of at least one group */
export function useCanManageSportEventsQuery() {
  const { data, ...rest } = useQuery({
    queryKey: ['group', 'canManageSportEvents'],

    queryFn: () => getGroupListApi({ pageSize: 1, canManageSportEvents: true }),
  });

  return { canManageSportEvents: (data?.count ?? 0) > 0, ...rest };
}
