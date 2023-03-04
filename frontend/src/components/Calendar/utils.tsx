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
