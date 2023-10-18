import { baseLanguages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

/**
 * Converts a TranslatedFieldsDTO to a TranslatedFieldObject.
 *
 * @param dataObject - A `{ title_fr, title_en, ...}` data-transfer object to convert
 * @param translatedFieldName - The name of the field to convert (eg. `title`)
 * @returns A translatedField object
 *
 * @example
 * > const dataObject = { title_fr: 'Bonjour', title_en: 'Hello', image: null };
 * > const translatedFieldName = 'title';
 * > const result = adaptTranslatedField(dataObject, translatedFieldName);
 * result = {
 *   fr: 'Bonjour',
 *   en: 'Hello'
 * }
 */
export function adaptTranslatedField<Field extends string>(
  dataObject: TranslatedFieldsDTO<Field>,
  translatedFieldName: Field,
): TranslatedFieldObject {
  const translatedFieldObject: Partial<TranslatedFieldObject> = {};

  for (const lang of baseLanguages) {
    const key = `${translatedFieldName}_${lang}`;
    translatedFieldObject[lang] = dataObject[key] || '';
  }

  return translatedFieldObject as TranslatedFieldObject;
}
