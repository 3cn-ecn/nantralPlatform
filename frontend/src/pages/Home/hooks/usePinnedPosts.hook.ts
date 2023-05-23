import { useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';

export function usePinnedPosts() {
  const { data, refetch, ...rest } = useQuery({
    queryKey: ['posts', { pinned: true }],
    queryFn: () =>
      getPostList({
        pinned: true,
      }),
  });

  return {
    pinnedPosts: data,
    refetchPinnedPosts: refetch,
    ...rest,
  };
}
