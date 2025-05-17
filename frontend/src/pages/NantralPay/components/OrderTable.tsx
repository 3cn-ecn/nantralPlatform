import { useState } from 'react';

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
import { ModalOrderInfo } from '#modules/nantralpay/view/Modal/ModalOrderInfo';
import { ModalOrderQRCode } from '#modules/nantralpay/view/Modal/ModalOrderQRCode';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { OrderListQueryParams } from '../hooks/useFilters';
import { OrderRow } from './OrderRow';
import { OrderRowSkeleton } from './OrderRowSkeleton';

interface PaymentTableProps {
  data?: Page<Order>;
  filters: OrderListQueryParams;
  updateFilters: (val: Partial<OrderListQueryParams>) => void;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [qrCodeOrder, setQRCodeOrder] = useState<Order | undefined>();

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>{t('nantralpay.order.list.amount')}</TableCell>
              <TableCell>{t('nantralpay.order.list.date')}</TableCell>
              <TableCell>{t('nantralpay.order.list.sender')}</TableCell>
              <TableCell>{t('nantralpay.order.list.receiver')}</TableCell>
              <TableCell>{t('nantralpay.order.list.status')}</TableCell>
              <TableCell>{t('nantralpay.order.list.action')}</TableCell>
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
              data?.results.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                  onClickQRCode={() => setQRCodeOrder(order)}
                />
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
      {selectedOrder && (
        <ModalOrderInfo
          order={selectedOrder}
          open={true}
          onClose={() => {
            setSelectedOrder(undefined);
          }}
        />
      )}
      {qrCodeOrder && (
        <ModalOrderQRCode
          order={qrCodeOrder}
          open={true}
          onClose={() => {
            setQRCodeOrder(undefined);
          }}
        />
      )}
    </>
  );
}
