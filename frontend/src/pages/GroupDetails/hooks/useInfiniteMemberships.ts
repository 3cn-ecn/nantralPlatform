import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getMembershipListApi,
  GetMembershipListApiParams,
} from '#modules/group/api/getMembershipList.api';

export function useInfiniteMembership({
  options,
  enabled = true,
}: {
  options: GetMembershipListApiParams;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMembershipListApi({ ...options, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['members', { slug: options.group, ...options }],
    enabled: enabled,
  });

  return query;
}
