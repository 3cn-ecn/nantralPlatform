import { useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import {
  initReactI18next,
  useTranslation as useI18nextTranslation,
} from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const languages = ['fr-FR', 'en-GB', 'en-US'] as const;

// types and constants utils deduced from languages list
export type Language = (typeof languages)[number];
export type BaseLanguage = Language extends `${infer T}-${string}` ? T : never;

export function useFormTranslation({
  i18nKeys_en,
  i18nKeys_fr,
}: {
  i18nKeys_en: object;
  i18nKeys_fr: object;
}) {
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
        'fr-FR': { translation: i18nKeys_fr },
        'en-GB': { translation: i18nKeys_en },
      },
      returnNull: false,
      ns: 'form_translation',
    });

  const { t } = useI18nextTranslation('form_translation');

  return useMemo(() => {
    return {
      t: (
        key: string,
        defaultValue: string,
        context?: Record<string, unknown>,
      ) => {
        const translation = t(key, context);
        return translation === key ? defaultValue : translation;
      },
    };
  }, [t]);
}
