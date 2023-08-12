import { Editor } from '@ckeditor/ckeditor5-core';
import { i18n } from 'i18next';

import '#lib/ckeditor5/build/ckeditor';
import '#lib/ckeditor5/build/translations/en';
import '#lib/ckeditor5/build/translations/en-gb';

declare const ClassicEditor: typeof Editor;

export const CustomEditor = ClassicEditor;

export const getCKEditorLanguage = (i18n: i18n) => {
  const language = i18n.language;
  const languageMap = {
    'en-US': 'en',
    'en-GB': 'en-gb',
    'fr-FR': 'fr',
  };
  return languageMap[language] || 'en';
};
