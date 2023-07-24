import { upperFirst } from 'lodash-es';

export const getNativeLanguageName = (lang: string): string => {
  try {
    // try to get names for the asking language
    const displayName = new Intl.DisplayNames(lang, {
      type: 'language',
      style: 'short',
      languageDisplay: 'standard',
    });
    return upperFirst(displayName.of(lang)) || lang;
  } catch {
    // if lang argument is not a language code
    return lang;
  }
};
