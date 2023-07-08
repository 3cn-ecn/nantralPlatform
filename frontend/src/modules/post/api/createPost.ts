import axios, { AxiosResponse } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptPost } from '../infra/post.adapter';
import { convertPostForm } from '../infra/post.converter';
import { PostDTO, PostFormDTO } from '../infra/post.dto';
import { PostForm } from '../post.types';

export async function createPost(formData: PostForm) {
  const { data } = await axios
    .postForm<PostFormDTO, AxiosResponse<PostDTO>>(
      '/api/post/post/',
      convertPostForm(formData)
    )
    .catch((err: ApiErrorDTO<PostFormDTO>) => {
      throw adaptApiErrors(err);
    });
  return adaptPost(data);
}
