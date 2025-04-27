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
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

import { Transaction } from '#modules/nantralpay/types/transaction.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { TransactionListQueryParams } from '../hooks/useFilters';
import { TransactionRow } from './TransactionRow';
import { TransactionRowSkeleton } from './TransactionRowSkeleton';

interface TransactionTableProps {
  data: Page<Transaction>;
  filters: TransactionListQueryParams;
  updateFilters: (val: Partial<TransactionListQueryParams>) => void;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
}

export function TransactionTable({
  data,
  filters,
  updateFilters,
  isLoading,
  isFetching,
  isSuccess,
}: TransactionTableProps) {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('nantralpay.transaction.type')}</TableCell>
            <TableCell>{t('nantralpay.transaction.amount')}</TableCell>
            <TableCell>{t('nantralpay.transaction.sender')}</TableCell>
            <TableCell>{t('nantralpay.transaction.receiver')}</TableCell>
            <TableCell>{t('nantralpay.transaction.status')}</TableCell>
            <TableCell>{t('nantralpay.transaction.description')}</TableCell>
            <TableCell>{t('nantralpay.transaction.date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isFetching) &&
            Array(filters.pageSize)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <TransactionRowSkeleton key={i.toString()} />
              ))}
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data.results.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 75, 100]}
              labelRowsPerPage={'Résultats par page'}
              labelDisplayedRows={() =>
                t('nantralpay.list.labelDisplayedRows', {
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
