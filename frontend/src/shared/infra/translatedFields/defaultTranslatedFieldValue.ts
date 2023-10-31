import { baseLanguages } from '#shared/i18n/config';

import { TranslatedFieldObject } from './translatedField.types';

/**
 * A translated field object with an empty string for all languages.
 *
 * @example
 * { fr: '', en: '', ... }
 */
export const defaultTranslatedFieldValue = baseLanguages.reduce(
  (acc, lang) => ({ ...acc, [lang]: '' }),
  {} as TranslatedFieldObject,
);
