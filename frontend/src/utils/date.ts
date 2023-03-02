import i18n from 'i18next';

type DateType = 'short' | 'medium' | 'long' | 'full';

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
  dateFormat?: DateType,
  timeFormat?: DateType
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
export function formatTime(date: Date, timeFormat: DateType) {
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

/**
 * Get the number of days in a month.
 * @param year The year of the month.
 * @param month The month.
 * @returns The number of days in the month.
 */
export function numberOfDayInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the number of days in a month.
 * @param date The date in the month.
 * @returns The number of days in the month.
 */
export function numberOfDayInDateMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
