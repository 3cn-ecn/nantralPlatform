import { global_languages } from '#shared/i18n/config';

import { PostForm } from '../post.types';
import { PostFormDTO } from './post.dto';

export function convertPostForm(post: PostForm): PostFormDTO {
  const translatedConverter: PostFormDTO = {};
  let translated_title: string;
  let translated_description: string;
  for (const lang of global_languages) {
    if (post[`title_${lang}`]) {
      translated_title = post[`title_${lang}`];
    }
    if (post[`description_${lang}`]) {
      translated_description = post[`description_${lang}`];
    }
  }
  for (const lang of global_languages) {
    if (!post[`title_${lang}`]) {
      post[`title_${lang}`] = translated_title;
    }
    if (!post[`description_${lang}`] && translated_description) {
      post[`description_${lang}`] = translated_description;
    }
    translatedConverter[`title_${lang}`] = post[`title_${lang}`];
    translatedConverter[`description_${lang}`] = post[`description_${lang}`];
  }
  return {
    title: post.title,
    ...translatedConverter,
    description: post.description,
    pinned: post.pinned,
    publicity: post.publicity,
    group: post.group,
    image: post.image,
  };
}
