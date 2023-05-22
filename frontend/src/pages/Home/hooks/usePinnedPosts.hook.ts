import { useQuery } from 'react-query';

import { getPosts } from '#api/post';

export function usePinnedPosts() {
  const { data, refetch, ...rest } = useQuery({
    queryKey: ['posts', { pinned: true }],
    queryFn: () =>
      getPosts({
        pinned: true,
      }),
  });

  return {
    pinnedPosts: data,
    refetchPinnedPosts: refetch,
    ...rest,
  };
}
