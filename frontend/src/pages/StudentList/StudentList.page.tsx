import { Container, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { FilterBar } from './components/FilterBar';
import { StudentTable } from './components/StudentTable';
import { useFilters } from './hooks/useFilters';

export default function StudentListPage() {
  const { t } = useTranslation();

  const [filters, updateFilters, resetFilters] = useFilters();

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h1">{t('navbar.student')}</Typography>
      <FilterBar
        resetFilters={resetFilters}
        updateFilters={updateFilters}
        filters={filters}
      />
      <StudentTable updateFilters={updateFilters} filters={filters} />
    </Container>
  );
}
