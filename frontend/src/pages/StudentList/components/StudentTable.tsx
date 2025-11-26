import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePaginationActions';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getStudentListApi } from '#modules/student/api/getStudentList.api';
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
  const { data, isSuccess, isFetching, isPending } = useQuery({
    queryFn: () => getStudentListApi(filters),
    queryKey: ['student', filters],
    placeholderData: keepPreviousData,
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
          {(isPending || isFetching) &&
            Array(filters.pageSize)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <StudentRowSkeleton key={i.toString()} />
              ))}
          {isSuccess &&
            !isPending &&
            !isFetching &&
            data.results.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
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
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
