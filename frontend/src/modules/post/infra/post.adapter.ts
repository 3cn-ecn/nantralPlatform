import { adaptGroupPreview } from '#modules/group/infra/group.adapter';
import { global_languages } from '#shared/i18n/config';

import { Post, PostPreview } from '../post.types';
import { PostDTO, PostPreviewDTO } from './post.dto';

export function adaptPostPreview(postDTO: PostPreviewDTO): PostPreview {
  const translatedAdapterPreview: PostPreview = {};
  for (const lang of global_languages) {
    translatedAdapterPreview[`title_${lang}`] = postDTO[`title_${lang}`];
  }
  return {
    id: postDTO.id,
    title: postDTO.title,
    ...translatedAdapterPreview,
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
  const translatedAdapter: Post = {};

  for (const lang of global_languages) {
    translatedAdapter[`description_${lang}`] = postDTO[`description_${lang}`];
  }
  return {
    ...adaptPostPreview(postDTO),
    description: postDTO.description,
    notificationId: postDTO.notification,
    ...translatedAdapter,
  };
}
