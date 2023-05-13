import { useTranslation as useI18nNextTranslation } from 'react-i18next';

const UNITS: { name: Intl.RelativeTimeFormatUnit; milliseconds: number }[] = [
  { name: 'year', milliseconds: 365 * 24 * 60 * 60 * 1000 },
  { name: 'month', milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { name: 'day', milliseconds: 24 * 60 * 60 * 1000 },
  { name: 'hour', milliseconds: 60 * 60 * 1000 },
  { name: 'minute', milliseconds: 60 * 1000 },
];

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

  const formatDuration = (
    toDate: Date,
    fromDate: Date = new Date(),
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ) => {
    const duration = toDate.getTime() - fromDate.getTime();
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
    formatDuration,
    formatNumber,
    formatNumberRange,
  };
}
