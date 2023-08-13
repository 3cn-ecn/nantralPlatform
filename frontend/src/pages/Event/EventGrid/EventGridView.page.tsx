import { useState } from 'react';

import { SearchField } from '#shared/components/FormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useDesktopMode } from '#shared/hooks/useDesktopMode';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useFilters } from '../hooks/useFilters';
import { FilterBar } from '../shared/FilterBar';
import { EventInfiniteGrid } from './EventInfiniteGrid';

export default function EventGridViewPage() {
  const { t } = useTranslation();
  const [filters, updateFilters, resetFilters] = useFilters();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDesktopMode = useDesktopMode();

  return (
    <>
      <SearchField
        value={filters.search || ''}
        handleChange={(val) => updateFilters({ search: val })}
        size="small"
        placeholder={t('event.search.placeholder')}
        margin="none"
        autoFocus={isDesktopMode}
      />
      <Spacer vertical={1.5} />
      <FilterBar
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Spacer vertical={4} />
      <EventInfiniteGrid filters={filters} disableLoading={isDrawerOpen} />
    </>
  );
}
