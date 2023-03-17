/**
 * Return true if date is in the 7 next days
 * @param date
 * @returns
 */
export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const in7days = new Date();
  in7days.setDate(today.getDate() + 7);
  return (
    today.getTime() <= date.getTime() && date.getTime() <= in7days.getTime()
  );
}

export function timeFromNow(date: Date): string {
  const seconds: number = (new Date().getTime() - date.getTime()) / 1000;
  if (seconds < 60) return `${Math.round(seconds).toString()} seconds`;
  const minutes: number = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes).toString()} minutes`;
  const hours: number = minutes / 60;
  if (hours < 60) return `${Math.round(hours).toString()} hours`;
  const days: number = hours / 24;
  if (days < 30) return `${Math.round(days).toString()} days`;
  const months: number = days / 30;
  if (months < 12) return `${Math.round(months).toString()} months`;
  const years: number = months / 12;
  return `${Math.round(years).toString()} years`;
}
