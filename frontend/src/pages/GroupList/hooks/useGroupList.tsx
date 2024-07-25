import { useInfiniteQuery } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useAuth } from '#shared/context/Auth.context';

export function useGroupList(type?: string) {
  const { isAuthenticated } = useAuth();
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getGroupListApi({ type: type, page: pageParam, pageSize: 6 * 7 }),
    queryKey: ['getGroupListByType', type, isAuthenticated],
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : null,
  });

  const groupsByCategory = groupBy(
    query.data?.pages?.map((page) => page.results).flat(),
    'category',
  );

  return {
    query: query,
    groupsByCategory,
    count: query.data?.pages[0].count,
  };
}
