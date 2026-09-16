import { useInfiniteQuery } from '@tanstack/react-query';

import { getPostListApi } from '#modules/post/api/getPostList.api';

export function useInfiniteGroupPosts({ groupSlug }: { groupSlug: string }) {
  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getPostListApi({ group: [groupSlug || ''], page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['posts', { slug: groupSlug }],
  });

  return query;
}
