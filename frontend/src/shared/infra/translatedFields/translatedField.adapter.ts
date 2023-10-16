import { uniq } from 'lodash-es';

import { languages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

export const base_languages = uniq(languages.map((lg) => lg.split('-')[0]));

export function adaptTranslatedField<Field extends string>(
  dataObject: TranslatedFieldsDTO<Field>,
  translatedFieldName: Field,
): TranslatedFieldObject {
  const translatedFieldObject: Partial<TranslatedFieldObject> = {};

  for (const lang of base_languages) {
    const key = `${translatedFieldName}_${lang}`;
    translatedFieldObject[lang] = dataObject[key];
  }

  return translatedFieldObject as TranslatedFieldObject;
}
