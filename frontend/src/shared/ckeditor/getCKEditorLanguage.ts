/**
 * NOTE: this function does nothing for the moment, because the translations
 * are not yet including during the build phase.
 *
 * To make this function working, we need to include the languages in the
 * vite config (vite.config.ts) with ckeditor-vite plugin. However, this
 * plugin does not support yet translations, but the team plans to implement it
 * soon.
 *
 * See this page to check the status of the plugin, and implement translations
 * when it will be available:
 * https://github.com/ckeditor/vite-plugin-ckeditor5
 */
import { i18n } from 'i18next';

export const getCKEditorLanguage = (i18n: i18n) => {
  const language = i18n.language;
  const languageMap = {
    'en-US': 'en',
    'en-GB': 'en-gb',
    'fr-FR': 'fr',
  };
  return languageMap[language] || 'en';
};
