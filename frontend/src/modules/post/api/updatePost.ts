import axios from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { convertPostForm } from '../infra/post.converter';
import { PostFormDTO } from '../infra/post.dto';
import { PostForm } from '../post.types';

export type UpdatePostVariables = {
  id: number;
  data: PostForm;
};

export async function updatePost({ id, data }: UpdatePostVariables) {
  await axios
    .putForm<PostFormDTO>(`/api/post/post/${id}/`, convertPostForm(data))
    .catch((err: ApiFormErrorDTO<PostFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
}
