import {
  differenceInCalendarWeeks,
  format,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import { useTranslation } from '#shared/i18n/useTranslation';

// weeks always start on Monday, whatever the locale
const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

/** Key of the week (Monday to Sunday) an event belongs to. */
export function getSportEventWeekKey(date: Date): string {
  return startOfWeek(date, WEEK_OPTIONS).toDateString();
}

/** Key of the day an event belongs to, inside its week. */
export function getSportEventDayKey(date: Date): string {
  return startOfDay(date).toDateString();
}

export function useWeekDisplay() {
  const { t, formatDate } = useTranslation();

  return (weekKey: string): string => {
    const monday = new Date(weekKey);
    const weekDifference = differenceInCalendarWeeks(
      monday,
      new Date(),
      WEEK_OPTIONS,
    );

    if (weekDifference === 0) {
      return t('sport.weekDisplay.thisWeek');
    }
    if (weekDifference === 1) {
      return t('sport.weekDisplay.nextWeek');
    }
    return t('sport.weekDisplay.weekOf', {
      date: formatDate(monday, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    });
  };
}

export function useDayDisplay() {
  const { dateFnsLocale } = useTranslation();

  return (dayKey: string): string => {
    const dayLabel = format(new Date(dayKey), 'EEEE', {
      locale: dateFnsLocale,
    });
    return dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1).toLowerCase();
  };
}
