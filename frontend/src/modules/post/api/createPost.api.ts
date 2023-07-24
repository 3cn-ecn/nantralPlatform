import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptPost } from '../infra/post.adapter';
import { convertPostForm } from '../infra/post.converter';
import { PostDTO, PostFormDTO } from '../infra/post.dto';
import { PostForm } from '../post.types';

export async function createPostApi(formData: PostForm) {
  const { data } = await axios
    .post<PostFormDTO, AxiosResponse<PostDTO>>(
      '/api/post/post/',
      convertPostForm(formData),
      {
        // convert data to FormData object only if there is an image,
        // because FormData removes fields with null values
        headers: formData.image
          ? { 'Content-Type': 'multipart/form-data' }
          : {},
      }
    )
    .catch((err: ApiFormErrorDTO<PostFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptPost(data);
}
