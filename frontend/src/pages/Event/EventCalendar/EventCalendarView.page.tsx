import { useState } from 'react';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';

import { useCalendarFilters } from '../hooks/useCalendarFilters';
import { FilterBar } from '../shared/FilterBar';
import { CalendarColumnsView } from './CalendarColumnsView/CalendarColumnsView';
import { CalendarGridView } from './CalendarGridView/CalendarGridView';
import { CalendarDateSelector } from './shared/CalendarDateSelector';
import { CalendarToolBar } from './shared/CalendarToolBar';

export function EventCalendarViewPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, updateFilters, resetFilters, viewMode] = useCalendarFilters();
  const bk = useBreakpoint('sm');

  return (
    <>
      {bk.isLarger && (
        <>
          <FilterBar
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            noDates
          />
          <Spacer vertical={2} />
        </>
      )}
      <FlexRow
        flexDirection={bk.isLarger ? 'row' : 'column-reverse'}
        justifyContent="space-between"
        alignItems={bk.isLarger ? 'center' : 'flex-start'}
        gap={1}
        maxWidth="100%"
      >
        <CalendarDateSelector
          filters={filters}
          updateFilters={updateFilters}
          viewMode={viewMode}
        />
        <CalendarToolBar
          viewMode={viewMode}
          filters={filters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          isSmallScreen={bk.isSmaller}
        />
      </FlexRow>
      <Spacer vertical={2} />
      {viewMode === 'days' ? (
        <CalendarColumnsView filters={filters} />
      ) : (
        <CalendarGridView filters={filters} />
      )}
    </>
  );
}
