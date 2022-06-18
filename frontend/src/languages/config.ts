import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationFr from './fr-FR.json';
import translationEn from './en-GB.json';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: ['fr-FR', 'en-GB'],
    fallbackLng: { 'fr-*': ['fr-FR'], default: ['en-GB'] },
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      'fr-FR': {
        translation: translationFr,
      },
      'en-GB': {
        translation: translationEn,
      },
    },
  });

export default i18n;
