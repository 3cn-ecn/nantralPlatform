import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useAuth } from '#shared/context/Auth.context';

export function useGroupChildren({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();

  const query = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getGroupListApi({ parent: slug, page: pageParam, pageSize: 50 }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next && allPages.length + 1,
    queryKey: ['children', { slug: slug }, isAuthenticated],
  });

  return query;
}
