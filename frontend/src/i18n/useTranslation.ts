import { useTranslation as useI18nNextTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nNextTranslation('translation');
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString(i18n.language, options);
  const formatDateTime = (date: Date, options: Intl.DateTimeFormatOptions) =>
    date.toLocaleString(i18n.language, options);
  const formatTime = (date: Date, options: Intl.DateTimeFormatOptions) =>
    date.toLocaleTimeString(i18n.language, options);
  const formatNumber = (number: number, options: Intl.NumberFormatOptions) =>
    number.toLocaleString(i18n.language, options);

  return {
    t,
    i18n,
    formatDate,
    formatDateTime,
    formatTime,
    formatNumber,
  };
}
