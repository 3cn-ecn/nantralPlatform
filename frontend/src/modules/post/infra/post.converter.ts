import { base_languages } from '#shared/i18n/config';

import { PostForm } from '../post.types';
import { PostFormDTO } from './post.dto';

export function convertPostForm(post: PostForm): PostFormDTO {
  const translatedConverter = {};
  let translated_title: string | null = null;
  let translated_description: string | null = null;
  for (const lang of base_languages) {
    translated_title = post[`title_${lang}`] || null;
    translated_description = post[`description_${lang}`] || null;
  }
  for (const lang of base_languages) {
    if (!post[`title_${lang}`] && translated_title) {
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
