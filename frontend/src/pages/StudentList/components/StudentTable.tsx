import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { useQuery } from '@tanstack/react-query';

import { getUserListApi } from '#modules/account/api/getUserList.api';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { StudentListQueryParams } from '../hooks/useFilters';
import { StudentRow } from './StudentRow';
import { StudentRowSkeleton } from './StudentRowSkeleton';

interface StudentTableProps {
  filters: StudentListQueryParams;
  updateFilters: (val: Partial<StudentListQueryParams>) => void;
}

export function StudentTable({ filters, updateFilters }: StudentTableProps) {
  const { t } = useTranslation();
  const { data, isSuccess, isFetching, isLoading } = useQuery({
    queryFn: () => getUserListApi(filters),
    queryKey: ['user', filters],
    keepPreviousData: true,
  });

  return (
    <TableContainer>
      <Table aria-label="simple table" size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>{t('student.picture.label')}</TableCell>
            <TableCell>{t('student.name.label')}</TableCell>
            <TableCell>{t('student.arrivalYear')}</TableCell>
            <TableCell>{t('login.formationFollowed.label')}</TableCell>
            <TableCell>{t('login.specialProgram.label')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isFetching) &&
            Array(filters.pageSize)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <StudentRowSkeleton key={i.toString()} />
              ))}
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data.results.map((user) => (
              <StudentRow key={user.id} user={user} />
            ))}
        </TableBody>
      </Table>
      <FlexRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 75, 100]}
          labelRowsPerPage={'Résultats par page'}
          labelDisplayedRows={() =>
            t('student.list.labelDisplayedRows', {
              page: filters.page,
              pageSize: data?.numPages,
              count: data?.count,
            })
          }
          count={data?.count || 0}
          rowsPerPage={filters.pageSize}
          page={filters.page - 1}
          sx={{ width: '100%' }}
          onPageChange={(e, p) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateFilters({ page: p + 1 });
          }}
          onRowsPerPageChange={(e) => {
            updateFilters({ pageSize: Number.parseInt(e.target.value) });
          }}
          ActionsComponent={TablePaginationActions}
          showFirstButton
          showLastButton
        />
      </FlexRow>
    </TableContainer>
  );
}
