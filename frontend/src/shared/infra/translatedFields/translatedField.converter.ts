import { baseLanguages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

export function convertTranslatedField<Field extends string>(
  translatedFieldObject: TranslatedFieldObject,
  translatedFieldName: Field,
): TranslatedFieldsDTO<Field> {
  const dataObject = {};

  for (const lang of baseLanguages) {
    const key = `${translatedFieldName}_${lang}`;
    dataObject[key] = translatedFieldObject[lang];
  }

  return dataObject as TranslatedFieldsDTO<Field>;
}
