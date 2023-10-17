import { baseLanguages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

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
