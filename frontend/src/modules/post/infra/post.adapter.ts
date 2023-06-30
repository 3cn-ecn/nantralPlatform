import { adaptGroupPreview } from '#modules/group/infra/group.adapter';

import { Post, PostPreview } from '../post.types';
import { PostDTO, PostPreviewDTO } from './post.dto';

export function adaptPostPreview(postDTO: PostPreviewDTO): PostPreview {
  return {
    id: postDTO.id,
    title: postDTO.title,
    createdAt: new Date(postDTO.created_at),
    updatedAt: new Date(postDTO.updated_at),
    image: postDTO.image,
    group: {
      ...adaptGroupPreview(postDTO.group),
      canPin: postDTO.can_pin,
    },
    pinned: postDTO.pinned,
    isAdmin: postDTO.is_admin,
    publicity: postDTO.publicity,
  };
}

export function adaptPost(postDTO: PostDTO): Post {
  return {
    ...adaptPostPreview(postDTO),
    description: postDTO.description,
  };
}
