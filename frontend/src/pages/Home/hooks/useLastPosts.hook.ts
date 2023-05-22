import { useQuery } from 'react-query';

import { getPosts } from '#api/post';

export function useLastPosts() {
  const today = new Date();
  const postDateLimit = new Date();
  postDateLimit.setDate(today.getDay() - 15);

  const { data, refetch, ...rest } = useQuery({
    queryKey: ['posts', { pinned: false }],
    queryFn: () =>
      getPosts({
        pinned: false,
        fromDate: postDateLimit,
      }),
  });

  return {
    lastPosts: data,
    refetchLastPosts: refetch,
    ...rest,
  };
}
