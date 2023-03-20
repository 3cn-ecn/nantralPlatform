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

/**
 * Get first day of a month
 * @param date A date in the month.
 * @returns The first day of the month.
 */
export function firstMonthDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 0);
}
