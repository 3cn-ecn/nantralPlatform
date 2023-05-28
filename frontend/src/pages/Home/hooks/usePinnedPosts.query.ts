import { useState } from 'react';
import { useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';

export function usePinnedPostsQuery() {
  const [page, setPage] = useState(1);

  const { data, ...rest } = useQuery({
    queryKey: ['posts', { pinned: true }, page],
    queryFn: () =>
      getPostList({
        pinned: true,
        page: page,
        pageSize: 3,
      }),
  });

  return {
    pinnedPosts: data && data.results,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
