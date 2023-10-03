import { StaticDatePicker } from '@mui/x-date-pickers';
import { endOfMonth, startOfMonth } from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';

interface StaticMonthPickerProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (
    newFilter: Partial<EventListQueryParams & { fromDate: Date; toDate: Date }>,
  ) => void;
  onClose: () => void;
}

export function StaticMonthPicker({
  filters,
  updateFilters,
  onClose,
}: StaticMonthPickerProps) {
  return (
    <StaticDatePicker
      value={filters.fromDate}
      onAccept={(val) =>
        updateFilters({
          fromDate: val ? startOfMonth(val) : undefined,
          toDate: val ? endOfMonth(val) : undefined,
        })
      }
      onClose={onClose}
      views={['month', 'year']}
    />
  );
}
