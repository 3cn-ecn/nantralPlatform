import { UseQueryOptions, useQuery } from 'react-query';

import { getPostDetails } from '#modules/post/api/getPostDetails';
import { Post } from '#modules/post/post.types';

export function usePostDetailsQuery(
  postId: number,
  options?: UseQueryOptions<Post>
) {
  const { data, ...rest } = useQuery({
    queryKey: ['post', { id: postId }],
    queryFn: () => getPostDetails(postId),
    ...options,
  });

  return {
    post: data,
    ...rest,
  };
}
