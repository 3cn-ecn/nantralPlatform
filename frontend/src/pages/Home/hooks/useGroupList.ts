import { useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';

export function useGroupList() {
  const query = useQuery({
    queryKey: ['myGroupList'],
    queryFn: () => getGroupListApi({ isMember: true }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : null,
  });

  return query.data?.results || [];
}
