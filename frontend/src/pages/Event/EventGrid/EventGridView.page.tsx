import { useState } from 'react';

import { SearchField } from '#shared/components/FormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { FilterBar } from '../components/FilterBar';
import { useFilters } from '../hooks/useFilters';
import { EventInfiniteGrid } from './EventInfiniteGrid';

export default function EventGridViewPage() {
  const { t } = useTranslation();
  const [filters, setFilters, updateFilters] = useFilters();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <SearchField
        value={filters.search || ''}
        handleChange={(val) => updateFilters({ search: val })}
        size="small"
        placeholder={t('event.search.placeholder')}
      />
      <FilterBar
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={() => setFilters({})}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Spacer vertical={4} />
      <EventInfiniteGrid filters={filters} disableLoading={isDrawerOpen} />
    </>
  );
}
