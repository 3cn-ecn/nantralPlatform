import { useState } from 'react';

import { FilterList as FilterListIcon } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { FilterDrawer } from '#pages/Event/shared/FilterDrawer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarViewMode } from '../types';
import { CalendarViewModeButton } from './CalendarViewModeButton';

interface CalendarToolBarProps {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (newFilter: Partial<EventListQueryParams>) => void;
  resetFilters: () => void;
  viewMode: CalendarViewMode;
  isSmallScreen?: boolean;
}

export function CalendarToolBar({
  filters,
  updateFilters,
  resetFilters,
  viewMode,
  isSmallScreen = false,
}: CalendarToolBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1}>
      {isSmallScreen && (
        <Button
          startIcon={<FilterListIcon />}
          variant="contained"
          onClick={() => setIsDrawerOpen(true)}
          color="secondary"
          // size="small"
        >
          {t('event.filters.title')}
        </Button>
      )}
      <CalendarViewModeButton
        filters={filters}
        updateFilters={updateFilters}
        viewMode={viewMode}
        // size={isSmallScreen ? 'small' : 'medium'}
      />
      <FilterDrawer
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        noDates
      />
    </Stack>
  );
}
