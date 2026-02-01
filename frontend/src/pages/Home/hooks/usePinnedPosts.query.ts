import { useState } from 'react';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getPostListApi } from '#modules/post/api/getPostList.api';
import { PostPreview } from '#modules/post/post.types';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function usePinnedPostsQuery(
  numberOfPosts: number,
  options?: Partial<UseQueryOptions<Page<PostPreview>>>,
) {
  const [page, setPage] = useState(1);

  const query = useQuery<Page<PostPreview>, ApiError>({
    queryKey: ['posts', { pinned: true }, page],
    queryFn: () =>
      getPostListApi({
        pinned: true,
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
