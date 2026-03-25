import { useState } from 'react';

import { useTheme } from '@mui/material';
import {
  PickersDay,
  PickersDayProps,
  StaticDatePicker,
} from '@mui/x-date-pickers';
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  isSameDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { modulo } from '#shared/utils/maths';

interface StaticMultipleDaysPickerProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (
    newFilter: Partial<EventListQueryParams & { fromDate: Date; toDate: Date }>,
  ) => void;
  onClose: () => void;
  keepInRange?: boolean;
}

export function StaticMultipleDaysPicker({
  filters,
  updateFilters,
  onClose,
  keepInRange = false,
}: StaticMultipleDaysPickerProps) {
  const nbOfDays =
    differenceInCalendarDays(filters.toDate, filters.fromDate) + 1;

  const [value, setValue] = useState<Date | null>(
    keepInRange ? filters.fromDate : addDays(filters.fromDate, nbOfDays / 2),
  );

  const startDate = value
    ? keepInRange
      ? subDays(
          value,
          modulo(differenceInCalendarDays(value, filters.fromDate), nbOfDays),
        )
      : subDays(value, nbOfDays / 2)
    : undefined;

  const endDate = startDate && addDays(startDate, nbOfDays - 1);

  return (
    <StaticDatePicker
      value={value}
      onChange={(val) => setValue(val)}
      onAccept={() =>
        updateFilters({
          fromDate: startDate ? startOfDay(startDate) : undefined,
          toDate: endDate ? endOfDay(endDate) : undefined,
        })
      }
      onClose={onClose}
      showDaysOutsideCurrentMonth
      slots={{ day: CustomDay }}
      slotProps={{
        day: {
          start: startDate,
          end: endDate,
        } as CustomDayProps,
      }}
    />
  );
}

// A custom Day component renderer to also renders dates between 2 dates
type CustomDayProps = PickersDayProps & {
  start: Date | null;
  end: Date | null;
};
function CustomDay({ day, start, end, ...props }: CustomDayProps) {
  const theme = useTheme();

  if (
    start == null ||
    end == null ||
    differenceInCalendarDays(end, start) === 0
  ) {
    return <PickersDay day={day} {...props} />;
  }

  const dayIsBetween = isWithinInterval(day, { start, end });
  const isFirstDay = isSameDay(day, start);
  const isLastDay = isSameDay(day, end);

  return (
    <PickersDay
      {...props}
      day={day}
      sx={{
        ...(dayIsBetween && {
          borderRadius: 0,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
          },
          px: 2.5,
          mx: 0,
        }),
        ...(isFirstDay && {
          borderTopLeftRadius: '50%',
          borderBottomLeftRadius: '50%',
        }),
        ...(isLastDay && {
          borderTopRightRadius: '50%',
          borderBottomRightRadius: '50%',
        }),
      }}
    />
  );
}
