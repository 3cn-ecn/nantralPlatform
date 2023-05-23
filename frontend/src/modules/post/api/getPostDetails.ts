import axios from 'axios';

import { adaptPost } from '../infra/post.adapter';
import { PostDTO } from '../infra/post.dto';

export async function getPostDetails(id: number) {
  const { data } = await axios.get<PostDTO>(`/api/post/${id}/`);

  return adaptPost(data);
}
