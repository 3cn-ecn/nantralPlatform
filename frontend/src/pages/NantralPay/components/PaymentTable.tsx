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

import { PaymentPreview } from '#modules/nantralpay/types/payment.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { TransactionListQueryParams } from '../hooks/useFilters';
import { PaymentRow } from './PaymentRow';
import { PaymentRowSkeleton } from './PaymentRowSkeleton';

interface PaymentTableProps {
  data: Page<PaymentPreview>;
  filters: TransactionListQueryParams;
  updateFilters: (val: Partial<TransactionListQueryParams>) => void;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
}

export function PaymentTable({
  data,
  filters,
  updateFilters,
  isLoading,
  isFetching,
  isSuccess,
}: PaymentTableProps) {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('nantralpay.payment.id')}</TableCell>
            <TableCell>{t('nantralpay.payment.haPaymentId')}</TableCell>
            <TableCell>{t('nantralpay.payment.haOrderId')}</TableCell>
            <TableCell>{t('nantralpay.payment.status')}</TableCell>
            <TableCell>{t('nantralpay.payment.amount')}</TableCell>
            <TableCell>{t('nantralpay.payment.date')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(isLoading || isFetching) &&
            Array(filters.pageSize)
              .fill(0)
              .map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <PaymentRowSkeleton key={i.toString()} />
              ))}
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data.results.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
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
