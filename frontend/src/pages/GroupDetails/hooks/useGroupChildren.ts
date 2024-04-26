import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { useAuth } from '#shared/context/Auth.context';

export function useGroupChildren({ slug }: { slug: string }) {
  const { isAuthenticated } = useAuth();

  const { ref, inView } = useInView();

  const {
    data: children,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getGroupListApi({ parent: slug, page: pageParam, pageSize: 50 }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next && allPages.length + 1,
    queryKey: ['children', { slug: slug }, isAuthenticated],
  });

  useEffect(() => {
    !isLoading && hasNextPage && inView && fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isLoading]);

  return { children, isLoading, ref, isFetchingNextPage };
}
