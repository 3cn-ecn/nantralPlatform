import { upperFirst } from 'lodash-es';

/**
 * Get the short name of a language in a specific language.
 *
 * @param lang - Language code
 * @param displayedLang - Language code of the language in which the name should be displayed
 * @returns {string} The name of the language in the displayed language
 *
 * @example
 * > getLanguageName('en-GB', 'fr-FR')
 * 'Anglais (R.-U.)'
 * > getLanguageName('fr-CH', 'en-GB')
 * 'French (Switzerland)'
 */
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

/**
 * Get the name of a language in its native language.
 *
 * @param lang - Language code
 * @returns The name of the language in its native language
 * @see {@link getLanguageName}
 *
 * @example
 * > getNativeLanguageName('ja-JP')
 * '日本語 (日本)'
 * > getNativeLanguageName('en-GB')
 * 'English (UK)'
 */
export const getNativeLanguageName = (lang: string): string => {
  return getLanguageName(lang, lang);
};
