import axios from 'axios';

import { adaptPost } from '../infra/post.adapter';
import { PostDTO } from '../infra/post.dto';
import { Post } from '../post.types';

type GetPostListParams = {
  pinned?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
};

export async function getPostList(
  options: GetPostListParams = {}
): Promise<Array<Post>> {
  const { data } = await axios.get<PostDTO[]>('/api/post/', {
    params: {
      pinned: options.pinned,
      from_date: options.fromDate,
      to_date: options.toDate,
      limit: options.limit,
    },
  });

  return data.map((post) => adaptPost(post));
}
