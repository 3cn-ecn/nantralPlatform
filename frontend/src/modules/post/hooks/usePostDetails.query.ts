import { UseQueryOptions, useQuery } from 'react-query';

import { getPostDetails } from '#modules/post/api/getPostDetails';
import { Post } from '#modules/post/post.types';
import { ApiErrorDTO } from '#shared/infra/errors';

export function usePostDetailsQuery(
  postId: number,
  options?: UseQueryOptions<Post>
) {
  const { data, ...rest } = useQuery<Post, ApiErrorDTO>({
    queryKey: ['post', { id: postId }],
    queryFn: () => getPostDetails(postId),
    ...options,
  });

  return {
    post: data,
    ...rest,
  };
}
