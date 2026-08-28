import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfDay,
} from 'date-fns';
import { useTranslation } from '#shared/i18n/useTranslation';

function toDate(value: string): Date {
  const isoDate = parseISO(value);
  if (isValid(isoDate)) {
    return isoDate;
  }

  const fallbackDate = new Date(value);
  return isValid(fallbackDate) ? fallbackDate : new Date(NaN);
}

export function useDayDisplay() {
  const { t, dateFnsLocale } = useTranslation();

  return (date: string): string => {
    const targetDate = toDate(date);
    if (!isValid(targetDate)) {
      return date;
    }

    const today = startOfDay(new Date());
    const dayDifference = differenceInCalendarDays(targetDate, today);

    if (dayDifference < 0) {
      return t('sport.dayDisplay.completed');
    }

    if (dayDifference > 7) {
      return t('sport.dayDisplay.later');
    }

    const dayLabel = format(targetDate, 'EEEE', { locale: dateFnsLocale });
    return dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1).toLowerCase();
  };
}
