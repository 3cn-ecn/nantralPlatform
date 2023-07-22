import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptPost } from '../infra/post.adapter';
import { PostDTO } from '../infra/post.dto';

export async function getPostDetailsApi(id: number) {
  const { data } = await axios
    .get<PostDTO>(`/api/post/post/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPost(data);
}
