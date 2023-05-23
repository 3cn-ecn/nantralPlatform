import { adaptPartialGroup } from '#modules/group/infra/group.adapter';

import { Post } from '../post.types';
import { PostDTO } from './post.dto';

export function adaptPost(postDTO: PostDTO): Post {
  return {
    id: postDTO.id,
    title: postDTO.title,
    description: postDTO.description,
    createdAt: new Date(postDTO.created_at),
    updatedAt: new Date(postDTO.updated_at),
    image: postDTO.image,
    group: adaptPartialGroup(postDTO.group),
    color: postDTO.color,
    publicity: postDTO.publicity,
    pinned: postDTO.pinned,
    canPin: postDTO.can_pin,
    isAdmin: postDTO.is_admin,
  };
}
