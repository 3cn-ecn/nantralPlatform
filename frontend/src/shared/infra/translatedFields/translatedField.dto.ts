import { BaseLanguage } from '#shared/i18n/config';

export type TranslatedFieldsDTO<Fields extends string> = {
  [Lang in BaseLanguage as `${Fields}_${Lang}`]: string | null;
};
