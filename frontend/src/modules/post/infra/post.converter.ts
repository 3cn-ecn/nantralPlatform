import { PostForm } from '../post.types';
import { PostFormDTO } from './post.dto';

export function convertPostForm(post: PostForm): PostFormDTO {
  return {
    title: post.title,
    description: post.description,
    pinned: post.pinned,
    publicity: post.publicity,
    group: post.group,
    image: post.image,
  };
}
