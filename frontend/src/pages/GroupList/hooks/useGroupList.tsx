import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';
import { groupBy } from 'lodash-es';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useAuth } from '#shared/context/Auth.context';

export function useGroupList(type?: string) {
  const { isAuthenticated } = useAuth();
  const { inView, ref } = useInView();
  const {
    data: groups,
    isSuccess,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getGroupListApi({ type: type, page: pageParam, pageSize: 50 }),
    queryKey: ['getGroupListByType', type, isAuthenticated],
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : null,
  });

  const groupsByCategory = groupBy(
    groups?.pages?.map((page) => page.results).flat(),
    'category',
  );

  useEffect(() => {
    !isLoading && hasNextPage && inView && fetchNextPage();
  }, [hasNextPage, fetchNextPage, isLoading, groups, inView]);

  return {
    ref,
    groupsByCategory,
    isSuccess,
    count: groups?.pages[0].count,
    isLoading,
  };
}
