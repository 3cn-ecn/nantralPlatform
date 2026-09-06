import { differenceInCalendarDays, format, startOfDay } from 'date-fns';

import { useTranslation } from '#shared/i18n/useTranslation';

export const LATER_GROUP_KEY = 'later';

/** Groups events more than 7 days away under a single `LATER_GROUP_KEY` bucket, and each of the next 7 days under its own key. */
export function getSportEventGroupKey(date: Date): string {
  const today = startOfDay(new Date());
  const dayDifference = differenceInCalendarDays(date, today);
  return dayDifference > 7 ? LATER_GROUP_KEY : date.toDateString();
}

export function useDayDisplay() {
  const { t, dateFnsLocale } = useTranslation();

  return (groupKey: string, sampleDate?: Date): string => {
    if (groupKey === LATER_GROUP_KEY) {
      return t('sport.dayDisplay.later');
    }

    const date = sampleDate ?? new Date(groupKey);
    const dayLabel = format(date, 'EEEE', { locale: dateFnsLocale });
    return dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1).toLowerCase();
  };
}
