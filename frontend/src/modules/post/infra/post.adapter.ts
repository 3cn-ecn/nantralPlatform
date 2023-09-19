import { adaptGroupPreview } from '#modules/group/infra/group.adapter';
import { languages_without_locales } from '#shared/i18n/config';

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
  const translatedAdapter: Post = {};

  for (const lang of languages_without_locales) {
    translatedAdapter[`title_${lang}`] = postDTO[`title_${lang}`];
    translatedAdapter[`description_${lang}`] = postDTO[`description_${lang}`];
  }
  return {
    ...adaptPostPreview(postDTO),
    description: postDTO.description,
    notificationId: postDTO.notification,
    ...translatedAdapter,
  };
}
