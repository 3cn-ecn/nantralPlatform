import i18n from 'i18next';

/**
 * Format a datetime according to the current language
 *
 * @param date The date object to format
 * @param dateFormat The format for the date
 * @param timeFormat The format for the time
 * @returns A string representing the datetime formatted
 */
export function formatDate(
  date: Date,
  dateFormat?: 'short' | 'medium' | 'long' | 'full',
  timeFormat?: 'short' | 'medium' | 'long' | 'full'
) {
  const lang = i18n.language;
  const customFormat = {
    ...(dateFormat ? { dateStyle: dateFormat } : {}),
    ...(timeFormat ? { timeStyle: timeFormat } : {}),
  };
  const formatter = new Intl.DateTimeFormat(lang, customFormat);
  return formatter.format(date);
}

/**
 * Format a time according to the current language
 *
 * @param date The date object to format
 * @param timeFormat The format for the time
 * @returns A string represented the time formatted
 */
export function formatTime(
  date: Date,
  timeFormat: 'short' | 'medium' | 'long' | 'full'
) {
  return formatDate(date, undefined, timeFormat);
}

export function isThisWeek(date: Date): boolean {
  const todayTime: number = date.getTime();
  const monday = new Date();
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  const sunday = new Date();
  sunday.setDate(sunday.getDate() - sunday.getDay() + 8);
  return todayTime >= monday.getTime() && todayTime <= sunday.getTime();
}
