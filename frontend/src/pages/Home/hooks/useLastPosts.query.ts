import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';
import { PostPreview } from '#modules/post/post.types';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useLastPostsQuery(
  numberOfPosts: number,
  options?: UseQueryOptions<Page<PostPreview>>
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<PostPreview>, ApiError>({
    queryKey: ['posts', 'last-posts', page],
    queryFn: () =>
      getPostList({
        pinned: false,
        page: page,
        pageSize: numberOfPosts,
      }),
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
  };
}
