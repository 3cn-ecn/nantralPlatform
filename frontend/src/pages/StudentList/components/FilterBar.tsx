import { useState } from 'react';

import { FilterAlt } from '@mui/icons-material';
import { Button, Chip } from '@mui/material';

import { Curriculum, Faculties } from '#modules/account/user.types';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { SearchField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

import { StudentListQueryParams } from '../hooks/useFilters';
import { FilterDrawer } from './FilterDrawer';

interface StudentFiltersProps {
  updateFilters: (val: Partial<StudentListQueryParams>) => void;
  filters: StudentListQueryParams;
  resetFilters: () => void;
}

export function FilterBar({
  updateFilters,
  filters,
  resetFilters,
}: StudentFiltersProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <SearchField
        size="small"
        placeholder={t('student.searchBar.placeholder')}
        handleChange={(val) => {
          updateFilters({ search: val, page: 1 });
        }}
        value={filters.search}
      />
      <FlexRow overflow={'scroll'} gap={2} py={1} alignItems={'center'}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<FilterAlt />}
          onClick={() => setOpen(true)}
          sx={{ minWidth: 100 }}
        >
          {t('student.filters.title')}
        </Button>
        {filters.faculty && (
          <Chip
            label={t(Faculties[filters.faculty])}
            onDelete={() => updateFilters({ faculty: undefined })}
          />
        )}
        {filters.path && (
          <Chip
            label={t(Curriculum[filters.path])}
            onDelete={() => updateFilters({ path: undefined })}
          />
        )}
        {filters.promo && (
          <Chip
            label={filters.promo}
            onDelete={() => updateFilters({ promo: undefined })}
          />
        )}
      </FlexRow>
      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        resetFilters={resetFilters}
        updateFilters={updateFilters}
        filters={filters}
      />
    </>
  );
}
