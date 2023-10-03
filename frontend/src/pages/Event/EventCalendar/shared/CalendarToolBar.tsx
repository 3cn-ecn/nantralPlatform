import { useState } from 'react';

import { FilterList as FilterListIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { FilterDrawer } from '#pages/Event/shared/FilterDrawer';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CalendarViewMode } from '../types';
import { CalendarViewModeButton } from './CalendarViewModeButton';

type CalendarToolBarProps = {
  filters: EventListQueryParams & { fromDate: Date; toDate: Date };
  updateFilters: (
    newFilter: Partial<EventListQueryParams & { fromDate: Date; toDate: Date }>,
  ) => void;
  resetFilters: () => void;
  viewMode: CalendarViewMode;
  isSmallScreen?: boolean;
};

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
    <FlexRow gap={1}>
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
    </FlexRow>
  );
}
