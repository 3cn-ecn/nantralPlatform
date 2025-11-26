import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useMarkAsSeenMutation } from '#modules/notification/hooks/useMarkAsSeen.mutation';
import { getPostDetailsApi } from '#modules/post/api/getPostDetails.api';
import { Post } from '#modules/post/post.types';
import { ApiError } from '#shared/infra/errors';

export function usePostDetailsQuery(
  postId: number,
  { ...options }: Partial<UseQueryOptions<Post>> = {},
) {
  const { markAsSeen } = useMarkAsSeenMutation();

  const query = useQuery<Post, ApiError>({
    queryKey: ['post', { id: postId }],
    queryFn: () =>
      getPostDetailsApi(postId).then((data) => {
        if (data.notificationId)
          markAsSeen({ notificationId: data.notificationId });
        return data;
      }),
    ...options,
  });

  return query;
}
