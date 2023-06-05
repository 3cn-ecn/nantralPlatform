import { adaptPartialGroup } from '#modules/group/infra/group.adapter';

import { PartialPost, Post } from '../post.types';
import { PartialPostDTO, PostDTO } from './post.dto';

export function adaptPost(postDTO: PostDTO): Post {
  return {
    id: postDTO.id,
    title: postDTO.title,
    description: postDTO.description,
    createdAt: new Date(postDTO.created_at),
    updatedAt: new Date(postDTO.updated_at),
    image: postDTO.image,
    group: {
      ...adaptPartialGroup(postDTO.group),
      canPin: postDTO.can_pin,
    },
    publicity: postDTO.publicity,
    pinned: postDTO.pinned,
    isAdmin: postDTO.is_admin,
  };
}

export function adaptPartialPost(postDTO: PartialPostDTO): PartialPost {
  return {
    id: postDTO.id,
    title: postDTO.title,
    createdAt: new Date(postDTO.created_at),
    updatedAt: new Date(postDTO.updated_at),
    image: postDTO.image,
    group: {
      ...adaptPartialGroup(postDTO.group),
      canPin: postDTO.can_pin,
    },
    pinned: postDTO.pinned,
    isAdmin: postDTO.is_admin,
    publicity: postDTO.publicity,
  };
}
