import { languages } from '#shared/i18n/config';

type LanguageCode = (typeof languages)[number];

type BaseLanguage = LanguageCode extends `${infer T}-${string}` ? T : never;

export type TranslatedFieldObject = {
  [Lang in BaseLanguage as `${string & Lang}`]: string;
};
