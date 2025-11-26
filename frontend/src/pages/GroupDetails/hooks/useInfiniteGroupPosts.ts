import { useInfiniteQuery } from '@tanstack/react-query';

import { getPostListApi } from '#modules/post/api/getPostList.api';

export function useInfiniteGroupPosts({ groupSlug }: { groupSlug: string }) {
  const query = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPostListApi({ group: [groupSlug || ''], page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['posts', { slug: groupSlug }],
  });

  return query;
}
