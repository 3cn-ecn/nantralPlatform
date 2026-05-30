import { useMemo } from 'react';
import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { FORM_CONFIG } from '#modules/form/utils/constants';
import { useTranslation as useI18nextTranslation } from '#shared/i18n/useTranslation';

export const languages = ['fr-FR', 'en-GB', 'en-US'] as const;

export type Language = (typeof languages)[number];
export type BaseLanguage = Language extends `${infer T}-${string}` ? T : never;

export interface UseFormTranslationProps {
  i18nKeys_en: object;
  i18nKeys_fr: object;
  namespace?: string;
}

export function useFormTranslation({
  i18nKeys_en,
  i18nKeys_fr,
  namespace = 'form_translation',
}: UseFormTranslationProps) {
  // Initialize i18n only once
  if (!i18next.isInitialized) {
    i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        supportedLngs: languages,
        fallbackLng: FORM_CONFIG.FALLBACK_LANGUAGES,
        load: 'currentOnly',
        interpolation: {
          escapeValue: false,
        },
        detection: {
          caches: ['localStorage', 'cookie'],
          lookupCookie: 'language',
          cookieMinutes: 60 * 3,
        },
        resources: {
          'fr-FR': { [namespace]: i18nKeys_fr },
          'en-GB': { [namespace]: i18nKeys_en },
        },
        returnNull: false,
        ns: [namespace],
        defaultNS: namespace,
      });
  }

  const { t } = useI18nextTranslation(namespace);

  return useMemo(
    () => ({
      t: (
        key: string,
        defaultValue: string,
        context?: Record<string, unknown>,
      ) => {
        const translation = t(key, context);
        return translation === key ? defaultValue : translation;
      },
      i18n: i18next,
    }),
    [t],
  );
}
