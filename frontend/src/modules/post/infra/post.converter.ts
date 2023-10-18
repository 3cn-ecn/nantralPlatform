import { convertTranslatedField } from '#shared/infra/translatedFields/translatedField.converter';

import { PostForm } from '../post.types';
import { PostFormDTO } from './post.dto';

export function convertPostForm(post: PostForm): PostFormDTO {
  return {
    ...convertTranslatedField(post.titleTranslated, 'title'),
    ...convertTranslatedField(post.descriptionTranslated, 'description'),
    pinned: post.pinned,
    publicity: post.publicity,
    group: post.group,
    image: post.image,
  };
}
