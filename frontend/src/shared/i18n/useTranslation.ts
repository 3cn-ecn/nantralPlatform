import { useTranslation as useI18nextTranslation } from 'react-i18next';

const UNITS: { name: Intl.RelativeTimeFormatUnit; milliseconds: number }[] = [
  { name: 'year', milliseconds: 365 * 24 * 60 * 60 * 1000 },
  { name: 'month', milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { name: 'day', milliseconds: 24 * 60 * 60 * 1000 },
  { name: 'hour', milliseconds: 60 * 60 * 1000 },
  { name: 'minute', milliseconds: 60 * 1000 },
];

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation('translation');

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

  const formatRelativeTime = (
    date: Date,
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ) => {
    const now = new Date();
    const duration = date.getTime() - now.getTime();
    const unit =
      UNITS.find((u) => Math.abs(duration) >= u.milliseconds) || UNITS.at(-1);
    const relativeTimeFormatter = new Intl.RelativeTimeFormat(
      i18n.language,
      options
    );
    const relativeTime = relativeTimeFormatter.format(
      Math.floor(duration / unit.milliseconds),
      unit.name
    );
    return relativeTime;
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
  };
}
