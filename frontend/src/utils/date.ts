import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation('translation');
  let time: string;
  const seconds: number = (new Date().getTime() - date.getTime()) / 1000;
  const minutes: number = seconds / 60;
  const hours: number = minutes / 60;
  const days: number = hours / 24;
  const months: number = days / 30;
  const years: number = months / 12;
  if (seconds < 0)
    return `${date.toLocaleString(i18n.language, { dateStyle: 'medium' })}`;
  if (seconds < 60)
    time = `${Math.round(seconds).toString()} ${t('time.seconds')}`;
  else if (minutes < 60)
    time = `${Math.round(minutes).toString()} ${t('time.minutes')}`;
  else if (hours < 60)
    time = `${Math.round(hours).toString()} ${t('time.hours')}`;
  else if (days < 30) time = `${Math.round(days).toString()} ${t('time.days')}`;
  else if (months < 12)
    time = `${Math.round(months).toString()} ${t('time.months')}`;
  else time = `${Math.round(years).toString()} ${t('time.years')}`;
  switch (i18n.language) {
    case 'en-EN':
      return `${time} ago`;
    case 'fr-FR':
      return `il y a ${time}`;
    default:
      return `${time} ago`;
  }
}
