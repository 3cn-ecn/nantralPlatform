// @ts-expect-error Handled by the vite bundler
import enTranslations from 'ckeditor5/translations/en';
// @ts-expect-error Handled by the vite bundler
import enGbTranslations from 'ckeditor5/translations/en-gb';
// @ts-expect-error Handled by the vite bundler
import frTranslations from 'ckeditor5/translations/fr';
import { i18n } from 'i18next';

export const CKEditorTranslations = [
  enTranslations,
  enGbTranslations,
  frTranslations,
];

/**
 * Map the i18n language to the CKEditor language
 * @param i18n - The i18n object (with standard tag in all Nantral Platform)
 * @returns - The CKEditor language (same tag as import)
 */
export const getCKEditorLanguage = (i18n: i18n): string => {
  const stdLang = i18n.language;
  const stdLangToCKEditorLang = {
    'en-US': 'en',
    'en-GB': 'en-gb',
    'fr-FR': 'fr',
  };
  return stdLangToCKEditorLang[stdLang] || 'en';
};
