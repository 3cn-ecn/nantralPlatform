import { languages } from '#shared/i18n/config';

type LanguageCode = (typeof languages)[number];

type BaseLanguage = LanguageCode extends `${infer T}-${string}` ? T : never;

export type TranslatedFieldsDTO<Fields extends string> = {
  [Lang in BaseLanguage as `${Fields}_${string & Lang}`]: string;
};
