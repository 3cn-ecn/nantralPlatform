import axios from 'axios';

import { convertPostForm } from '../infra/post.converter';
import { PostFormDTO } from '../infra/post.dto';
import { PostForm } from '../post.types';

type UpdatePostVariables = {
  id: number;
  data: PostForm;
};

export async function updatePost({ id, data }: UpdatePostVariables) {
  await axios.putForm<PostFormDTO>(
    `/api/post/post/${id}/`,
    convertPostForm(data)
  );
}
