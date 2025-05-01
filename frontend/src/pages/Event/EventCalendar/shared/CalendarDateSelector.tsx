import { useState } from 'react';

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { Button, Dialog, IconButton, Tooltip, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { upperFirst } from 'lodash-es';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarViewMode } from '../types';
import { StaticMonthPicker } from './DatePickers/StaticMonthPicker';
import { StaticMultipleDaysPicker } from './DatePickers/StaticMultipleDaysPicker';

interface CalendarDateSelectorProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (
    newFilter: Partial<EventListQueryParams & { fromDate: Date; toDate: Date }>,
  ) => void;
  viewMode: CalendarViewMode;
}

export function CalendarDateSelector({
  filters,
  updateFilters,
  viewMode,
}: CalendarDateSelectorProps) {
  const {
    t,
    formatDateTimeRange,
    formatDate,
    dateFnsLocale,
    startOfWeek,
    endOfWeek,
  } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title =
    viewMode === 'days'
      ? isSameDay(filters.fromDate, filters.toDate)
        ? upperFirst(formatDate(filters.fromDate, { dateStyle: 'full' }))
        : formatDateTimeRange(filters.fromDate, filters.toDate, {
            dateStyle: 'long',
          })
      : upperFirst(
          formatDate(filters.fromDate, { month: 'long', year: 'numeric' }),
        );

  const nbOfDays =
    differenceInCalendarDays(filters.toDate, filters.fromDate) + 1;

  const handlePrev = () =>
    viewMode === 'days'
      ? updateFilters({
          fromDate: subDays(filters.fromDate, nbOfDays),
          toDate: subDays(filters.toDate, nbOfDays),
        })
      : updateFilters({
          fromDate: subMonths(filters.fromDate, 1),
          toDate: endOfMonth(subMonths(filters.fromDate, 1)),
        });

  const handleNext = () =>
    viewMode === 'days'
      ? updateFilters({
          fromDate: addDays(filters.fromDate, nbOfDays),
          toDate: addDays(filters.toDate, nbOfDays),
        })
      : updateFilters({
          fromDate: addMonths(filters.fromDate, 1),
          toDate: endOfMonth(addMonths(filters.fromDate, 1)),
        });

  const handleToday = () => {
    const now = new Date();

    if (nbOfDays === 7)
      return updateFilters({
        fromDate: startOfWeek(now),
        toDate: endOfWeek(now),
      });

    if (nbOfDays > 7)
      return updateFilters({
        fromDate: startOfMonth(now),
        toDate: endOfMonth(now),
      });

    updateFilters({
      fromDate: startOfDay(now),
      toDate: endOfDay(addDays(now, nbOfDays - 1)),
    });
  };

  return (
    <>
      <FlexRow alignItems="center" overflow="auto">
        <Tooltip title={t('button.previous')}>
          <IconButton onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('button.next')}>
          <IconButton onClick={handleNext}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('button.today')}>
          <IconButton onClick={handleToday}>
            <TodayIcon />
          </IconButton>
        </Tooltip>
        <Button
          color="inherit"
          sx={{
            textTransform: 'none',
            minWidth: 'min-content',
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <Typography
            variant="h5"
            whiteSpace="nowrap"
            sx={{ transform: 'translateY(1px)' }}
          >
            {title}
          </Typography>
        </Button>
      </FlexRow>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        PaperProps={{ sx: { minWidth: '320px' } }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={dateFnsLocale}
        >
          {viewMode === 'days' ? (
            <StaticMultipleDaysPicker
              filters={filters}
              updateFilters={updateFilters}
              onClose={() => setIsModalOpen(false)}
              keepInRange={
                // if week view, do not allow to select range other than Monday-Sunday
                nbOfDays === 7 &&
                isSameDay(startOfWeek(filters.fromDate), filters.fromDate)
              }
            />
          ) : (
            <StaticMonthPicker
              filters={filters}
              updateFilters={updateFilters}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </LocalizationProvider>
      </Dialog>
    </>
  );
}
