import { baseLanguages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

type TranslatedFieldsDTOWithOriginal<Field extends string> =
  TranslatedFieldsDTO<Field> & Record<Field, undefined>;

/**
 * Converts a TranslatedFieldObject to a TranslatedFieldsDTO.
 *
 * This method also adds the original name of the field (without translation)
 * with an undefined value, because this field should never be sent to the
 * backend for a translated field but we need this key for typing errors
 * (errors for 'title_fr' or 'title_en' are sent under the key 'title').
 *
 * @param translatedFieldObject - A `{ fr: '', en: '', ...}` object to convert
 * @param translatedFieldName - The name of the field to convert
 * @returns An object with the translated field in all languages
 *
 * @example
 * > const translatedFieldObject = { fr: 'Bonjour', en: 'Hello' };
 * > const translatedFieldName = 'greeting';
 * > const result = convertTranslatedField(translatedFieldObject, translatedFieldName);
 * result = {
 *   greeting: undefined,
 *   greeting_fr: 'Bonjour',
 *   greeting_en: 'Hello'
 * }
 */
export function convertTranslatedField<Field extends string>(
  translatedFieldObject: TranslatedFieldObject,
  translatedFieldName: Field,
): TranslatedFieldsDTOWithOriginal<Field> {
  const dataObject: Partial<Record<string, string>> = {
    [translatedFieldName]: undefined,
  };

  for (const lang of baseLanguages) {
    const key = `${translatedFieldName}_${lang}`;
    dataObject[key] = translatedFieldObject[lang];
  }

  return dataObject as TranslatedFieldsDTOWithOriginal<Field>;
}
