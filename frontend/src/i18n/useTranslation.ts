import { useTranslation as useI18nNextTranslation } from 'react-i18next';

export function useTranslation() {
  const { t, i18n } = useI18nNextTranslation('translation');

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString(i18n.language, options);

  const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) =>
    date.toLocaleTimeString(i18n.language, options);

  const formatDateTime = (date: Date, options?: Intl.DateTimeFormatOptions) =>
    date.toLocaleString(i18n.language, options);

  const formatDateTimeRange = (
    startDate: Date,
    endDate: Date,
    options?: Intl.DateTimeFormatOptions
  ) => {
    const intlObject = Intl.DateTimeFormat(i18n.language, options);
    return intlObject.formatRange(startDate, endDate);
  };

  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) =>
    number.toLocaleString(i18n.language, options);

  const formatNumberRange = (
    startNumber: number,
    endNumber: number,
    options?: Intl.NumberFormatOptions
  ) => {
    const intlObject = Intl.NumberFormat(i18n.language, options);
    return intlObject.formatRange(startNumber, endNumber);
  };

  return {
    t,
    i18n,
    formatDate,
    formatTime,
    formatDateTime,
    formatDateTimeRange,
    formatNumber,
    formatNumberRange,
  };
}
