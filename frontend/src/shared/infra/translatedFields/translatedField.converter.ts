import { uniq } from 'lodash-es';

import { languages } from '#shared/i18n/config';

import { TranslatedFieldsDTO } from './translatedField.dto';
import { TranslatedFieldObject } from './translatedField.types';

export const base_languages = uniq(languages.map((lg) => lg.split('-')[0]));

export function convertTranslatedField<Field extends string>(
  translatedFieldObject: TranslatedFieldObject,
  translatedFieldName: Field,
): TranslatedFieldsDTO<Field> {
  const dataObject = {};

  for (const lang of base_languages) {
    const key = `${translatedFieldName}_${lang}`;
    dataObject[key] = translatedFieldObject[lang];
  }

  return dataObject as TranslatedFieldsDTO<Field>;
}
