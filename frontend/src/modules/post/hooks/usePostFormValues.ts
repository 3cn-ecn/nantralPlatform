import { Post, PostForm } from '#modules/post/post.types';
import { useObjectState } from '#shared/hooks/useObjectState';
import { defaultTranslatedFieldValue } from '#shared/infra/translatedFields/defaultTranslatedFieldValue';

const defaultPostFormValues: PostForm = {
  titleTranslated: defaultTranslatedFieldValue,
  descriptionTranslated: defaultTranslatedFieldValue,
  image: undefined,
  group: null,
  pinned: false,
  publicity: 'Pub',
};

function convertToForm(post: Post): PostForm {
  return {
    titleTranslated: post.titleTranslated,
    descriptionTranslated: post.descriptionTranslated,
    image: undefined,
    group: post.group.id,
    pinned: post.pinned,
    publicity: post.publicity,
  };
}

export function usePostFormValues({
  post,
  group,
}: { post?: Post; group?: number } = {}) {
  const defaultValues = post ? convertToForm(post) : defaultPostFormValues;
  if (group) {
    defaultValues.group = group;
  }
  return useObjectState(defaultValues);
}
