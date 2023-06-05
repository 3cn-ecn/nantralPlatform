import { useQuery } from 'react-query';

import { getPostDetails } from '#modules/post/api/getPostDetails';

export function usePostDetailsQuery(postId: number) {
  const { data, ...rest } = useQuery({
    queryKey: ['post', { id: postId }],
    queryFn: () => getPostDetails(postId),
  });

  return {
    post: data,
    ...rest,
  };
}
