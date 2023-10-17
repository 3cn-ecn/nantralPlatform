import { BaseLanguage, languages } from '#shared/i18n/config';

export type TranslatedFieldObject = {
  [Lang in BaseLanguage]: string;
};

/**
 * A translated field object with an empty string for all languages.
 *
 * @example
 * { fr: '', en: '', ... }
 */
export const emptyTranslatedFieldObject = Object.fromEntries(
  languages.map((lang) => [lang.split('-')[0], '']),
) as TranslatedFieldObject;
