import { upperFirst } from 'lodash-es';

export const getLanguageName = (
  lang: string,
  displayedLang: string,
): string => {
  try {
    // try to get names for the asking language
    const displayName = new Intl.DisplayNames(displayedLang, {
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
