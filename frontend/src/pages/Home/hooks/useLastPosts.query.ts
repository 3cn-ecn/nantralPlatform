import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';
import { PostPreview } from '#modules/post/post.types';
import { Page } from '#shared/infra/pagination';

export function useLastPostsQuery(
  options?: UseQueryOptions<Page<PostPreview>>
) {
  const [page, setPage] = useState(1);

  const { data, ...rest } = useQuery({
    queryKey: ['posts', 'last-posts', page],
    queryFn: () =>
      getPostList({
        pinned: false,
        page: page,
        pageSize: 3,
      }),
    ...options,
  });

  return {
    lastPosts: data && data.results,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
