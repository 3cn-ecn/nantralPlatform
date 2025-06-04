import { useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useTranslation as useI18nextTranslation } from 'react-i18next';

import {
  Locale,
  endOfWeek as fnsEndOfWeek,
  startOfWeek as fnsStartOfWeek,
  formatRelative,
} from 'date-fns';
import { enGB, enUS, fr } from 'date-fns/locale';

import { BaseLanguage, languages } from './config';

const mapLocales: Record<(typeof languages)[number], Locale> = {
  'fr-FR': fr,
  'en-GB': enGB,
  'en-US': enUS,
};

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation('translation');

  return useMemo(() => {
    const dateFnsLocale: Locale = mapLocales[i18n.language] || enGB;

    /** Base language without region: use only for translated fields */
    const currentBaseLanguage = i18n.language.split('-')[0] as BaseLanguage;

    const formatDate = (
      date: Date,
      options: Intl.DateTimeFormatOptions = { dateStyle: 'short' },
    ) => date.toLocaleDateString(i18n.language, options);

    const formatTime = (
      date: Date,
      options: Intl.DateTimeFormatOptions = { timeStyle: 'short' },
    ) => date.toLocaleTimeString(i18n.language, options);

    const formatDateTime = (
      date: Date,
      options: Intl.DateTimeFormatOptions = {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    ) => date.toLocaleString(i18n.language, options);

    const formatDateTimeRange = (
      startDate: Date,
      endDate: Date,
      options: Intl.DateTimeFormatOptions = {
        dateStyle: 'short',
        timeStyle: 'short',
      },
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
      options?: Intl.NumberFormatOptions,
    ) => {
      const intlObject = Intl.NumberFormat(i18n.language, options);
      return intlObject.formatRange(startNumber, endNumber);
    };

    const formatPrice = (number: number) => {
      const intlObject = Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: 'EUR',
      });
      return intlObject.format(number);
    };

    const startOfWeek = (date: Date) =>
      fnsStartOfWeek(date, { locale: dateFnsLocale });

    const endOfWeek = (date: Date) =>
      fnsEndOfWeek(date, { locale: dateFnsLocale });

    return {
      t,
      i18n,
      currentBaseLanguage,
      formatDate,
      formatTime,
      formatDateTime,
      formatDateTimeRange,
      formatRelativeTime,
      formatNumber,
      formatNumberRange,
      formatPrice,
      dateFnsLocale,
      startOfWeek,
      endOfWeek,
    };
  }, [t, i18n]);
}
