import { useState } from 'react';

import {
  CalendarViewDayRounded as CalendarViewDayIcon,
  CalendarViewMonthRounded as CalendarViewMonthIcon,
  CalendarViewWeekRounded as CalendarViewWeekIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ViewWeekRounded as ViewWeekIcon,
} from '@mui/icons-material';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarViewMode } from '../types';

interface CalendarViewModeButtonProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (
    newFilter: Partial<EventListQueryParams & { fromDate: Date; toDate: Date }>,
  ) => void;
  viewMode: CalendarViewMode;
  size?: 'small' | 'medium' | 'large';
}

export function CalendarViewModeButton({
  filters,
  updateFilters,
  viewMode,
  size = 'medium',
}: CalendarViewModeButtonProps) {
  const { t, startOfWeek, endOfWeek } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const nbOfDays =
    differenceInCalendarDays(filters.toDate, filters.fromDate) + 1;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleDaysChange = (daysToAdd: number) => {
    return () => {
      updateFilters({
        fromDate: filters.fromDate,
        toDate: addDays(filters.fromDate, daysToAdd - 1),
      });
      setIsOpen(false);
    };
  };
  const handleWeekChange = () => {
    updateFilters({
      fromDate: startOfWeek(filters.fromDate),
      toDate: endOfWeek(filters.fromDate),
    });
    setIsOpen(false);
  };
  const handleMonthChange = () => {
    updateFilters({
      fromDate: startOfMonth(filters.fromDate),
      toDate: endOfMonth(filters.fromDate),
    });
    setIsOpen(false);
  };

  const getViewModeLabel = (viewMode: CalendarViewMode, nbOfDays: number) => {
    if (viewMode === 'month') {
      return t('event.calendar.viewMode.month');
    }
    if (
      nbOfDays === 7 &&
      isSameDay(startOfWeek(filters.fromDate), filters.fromDate)
    ) {
      return t('event.calendar.viewMode.week');
    }
    if (nbOfDays === 1) {
      return t('event.calendar.viewMode.oneDay');
    }
    return t('event.calendar.viewMode.days', { nbOfDays });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        variant="outlined"
        color="secondary"
        size={size}
      >
        {getViewModeLabel(viewMode, nbOfDays)}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <MenuItem selected={nbOfDays === 1} onClick={handleDaysChange(1)}>
          <ListItemIcon>
            <CalendarViewDayIcon />
          </ListItemIcon>
          <ListItemText>{t('event.calendar.viewMode.oneDay')}</ListItemText>
        </MenuItem>
        <MenuItem selected={nbOfDays === 3} onClick={handleDaysChange(3)}>
          <ListItemIcon>
            <ViewWeekIcon />
          </ListItemIcon>
          <ListItemText>
            {t('event.calendar.viewMode.days', { nbOfDays: 3 })}
          </ListItemText>
        </MenuItem>
        <MenuItem
          selected={
            nbOfDays === 7 &&
            isSameDay(startOfWeek(filters.fromDate), filters.fromDate)
          }
          onClick={handleWeekChange}
        >
          <ListItemIcon>
            <CalendarViewWeekIcon />
          </ListItemIcon>
          <ListItemText>{t('event.calendar.viewMode.week')}</ListItemText>
        </MenuItem>
        <MenuItem selected={viewMode === 'month'} onClick={handleMonthChange}>
          <ListItemIcon>
            <CalendarViewMonthIcon />
          </ListItemIcon>
          <ListItemText>{t('event.calendar.viewMode.month')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
