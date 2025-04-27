import {
  Paper,
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

import { Order } from '#modules/nantralpay/types/order.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { TransactionListQueryParams } from '../hooks/useFilters';
import { OrderRow } from './OrderRow';
import { OrderRowSkeleton } from './OrderRowSkeleton';

interface PaymentTableProps {
  data?: Page<Order>;
  filters: TransactionListQueryParams;
  updateFilters: (val: Partial<TransactionListQueryParams>) => void;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
}

export function OrderTable({
  data,
  filters,
  updateFilters,
  isLoading,
  isFetching,
  isSuccess,
}: PaymentTableProps) {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="order table">
        <TableHead>
          <TableRow>
            <TableCell>{t('nantralpay.order.amount')}</TableCell>
            <TableCell>{t('nantralpay.order.date')}</TableCell>
            <TableCell>{t('nantralpay.order.reciever')}</TableCell>
            <TableCell>{t('nantralpay.order.status')}</TableCell>
            <TableCell>{t('nantralpay.order.description')}</TableCell>
            <TableCell>{t('nantralpay.order.action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isFetching) &&
            Array(filters.pageSize)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <OrderRowSkeleton key={i.toString()} />
              ))}
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data?.results.map((payment) => (
              <OrderRow key={payment.id} order={payment} />
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
