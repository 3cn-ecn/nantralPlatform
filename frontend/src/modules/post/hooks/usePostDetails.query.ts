import { UseQueryOptions, useQuery } from 'react-query';

import { getPostDetails } from '#modules/post/api/getPostDetails';
import { Post } from '#modules/post/post.types';
import { ApiError } from '#shared/infra/errors';

export function usePostDetailsQuery(
  postId: number,
  options?: UseQueryOptions<Post>
) {
  const query = useQuery<Post, ApiError>({
    queryKey: ['post', { id: postId }],
    queryFn: () => getPostDetails(postId),
    ...options,
  });

  return query;
}
