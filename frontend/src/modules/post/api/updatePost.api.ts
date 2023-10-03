import axios from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { convertPostForm } from '../infra/post.converter';
import { PostFormDTO } from '../infra/post.dto';
import { PostForm } from '../post.types';

export interface UpdatePostApiVariables {
  id: number;
  data: PostForm;
}

export async function updatePostApi({ id, data }: UpdatePostApiVariables) {
  await axios
    .put<PostFormDTO>(`/api/post/post/${id}/`, convertPostForm(data), {
      // convert data to FormData object only if there is an image,
      // because FormData removes fields with null values
      headers: data.image ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .catch((err: ApiFormErrorDTO<PostFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
}
