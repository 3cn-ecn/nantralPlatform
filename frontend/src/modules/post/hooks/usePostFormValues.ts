import { Post, PostForm } from '#modules/post/post.types';
import { useObjectState } from '#shared/hooks/useObjectState';
import { defaultTranslatedFieldValue } from '#shared/infra/translatedFields/defaultTranslatedFieldValue';

const defaultPostFormValues: PostForm = {
  title: '',
  titleTranslated: defaultTranslatedFieldValue,
  description: '',
  descriptionTranslated: defaultTranslatedFieldValue,
  image: undefined,
  group: null,
  pinned: false,
  publicity: 'Pub',
};

function convertToForm(post: Post): PostForm {
  return {
    title: post.title,
    titleTranslated: post.titleTranslated,
    description: post.description,
    descriptionTranslated: post.descriptionTranslated,
    image: undefined,
    group: post.group.id,
    pinned: post.pinned,
    publicity: post.publicity,
  };
}

export function usePostFormValues(post?: Post) {
  const defaultValues = post ? convertToForm(post) : defaultPostFormValues;

  return useObjectState(defaultValues);
}
