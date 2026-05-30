export const FORM_CONFIG = {
  NAMESPACE_PREFIX: 'form' as const,
  LANGUAGES: {
    EN: 'en-GB',
    FR: 'fr-FR',
  } as const,
  DEFAULT_LANGUAGE: 'en-GB' as const,
  FALLBACK_LANGUAGES: {
    'fr-*': ['fr-FR'],
    default: ['en-GB'],
  } as const,
} as const;

export const createFormNamespace = (uuid: string): string =>
  `${FORM_CONFIG.NAMESPACE_PREFIX}_${uuid}`;
