import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { uniq } from 'lodash-es';

import translationEn from './en-GB.json';
import translationFr from './fr-FR.json';

export const languages = ['fr-FR', 'en-GB', 'en-US'] as const;

// types and constants utils deduced from languages list
export type Language = (typeof languages)[number];
export type BaseLanguage = Language extends `${infer T}-${string}` ? T : never;
export const baseLanguages = uniq(
  languages.map((lg) => lg.split('-')[0] as BaseLanguage),
);

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: languages,
    fallbackLng: { 'fr-*': ['fr-FR'], default: ['en-GB'] },
    load: 'currentOnly',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      caches: ['localStorage', 'cookie'],
      lookupCookie: 'language',
      cookieMinutes: 60 * 3,
    },
    resources: {
      'fr-FR': { translation: translationFr },
      'en-GB': { translation: translationEn },
    },
    returnNull: false,
  });

export default i18n;

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
