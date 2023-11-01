import { BaseLanguage } from '#shared/i18n/config';

export type TranslatedFieldObject = {
  [Lang in BaseLanguage]: string;
};
