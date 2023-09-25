import { getLanguageName } from '#shared/utils/getLanguageName';

export const getNativeLanguageName = (lang: string): string => {
  return getLanguageName(lang, lang);
};
