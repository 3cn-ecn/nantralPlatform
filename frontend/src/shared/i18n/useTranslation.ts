import { useTranslation as useI18nextTranslation } from 'react-i18next';

import { Locale, formatRelative } from 'date-fns';
import { enGB, enUS, fr } from 'date-fns/locale';

import { languages } from './config';

const mapLocales: Record<(typeof languages)[number], Locale> = {
  'fr-FR': fr,
  'en-GB': enGB,
  'en-US': enUS,
};

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation('translation');

  const dateFnsLocale = mapLocales[i18n.language];

  const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'short' }
  ) => date.toLocaleDateString(i18n.language, options);

  const formatTime = (
    date: Date,
    options: Intl.DateTimeFormatOptions = { timeStyle: 'short' }
  ) => date.toLocaleTimeString(i18n.language, options);

  const formatDateTime = (
    date: Date,
    options: Intl.DateTimeFormatOptions = {
      dateStyle: 'short',
      timeStyle: 'short',
    }
  ) => date.toLocaleString(i18n.language, options);

  const formatDateTimeRange = (
    startDate: Date,
    endDate: Date,
    options: Intl.DateTimeFormatOptions = {
      dateStyle: 'short',
      timeStyle: 'short',
    }
  ) => {
    const intlObject = Intl.DateTimeFormat(i18n.language, options);
    return intlObject.formatRange(startDate, endDate);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    return formatRelative(date, now, {
      locale: dateFnsLocale,
      weekStartsOn: 1,
    });
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
    formatRelativeTime,
    formatNumber,
    formatNumberRange,
    dateFnsLocale,
  };
}
