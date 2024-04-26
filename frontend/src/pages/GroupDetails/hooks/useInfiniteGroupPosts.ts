import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getPostListApi } from '#modules/post/api/getPostList.api';

export function useInfiniteGroupPosts({ groupSlug }: { groupSlug: string }) {
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getPostListApi({ group: [groupSlug || ''], page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['posts', { slug: groupSlug }],
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return { data, ref };
}
