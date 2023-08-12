import { i18n } from 'i18next';

export class CustomEditor {
  static builtinPlugins = []; // Mock this if required

  static defaultConfig = {}; // Mock this if required
  config: unknown;

  constructor(config) {
    this.config = config;
  }

  init() {
    // Simulate initialization
    return Promise.resolve();
  }

  destroy() {
    // Simulate destruction
    return Promise.resolve();
  }

  // Any other methods or properties that are required
}

export const getCKEditorLanguage = (i18n: i18n) => {
  const language = i18n.language;
  const languageMap = {
    'en-US': 'en',
    'en-GB': 'en-gb',
    'fr-FR': 'fr',
  };
  return languageMap[language] || 'en';
};
