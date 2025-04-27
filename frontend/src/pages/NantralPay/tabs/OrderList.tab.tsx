import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getOrderListApi } from '#modules/nantralpay/api/getOrderList.api';
import { OrderDTO } from '#modules/nantralpay/infra/order.dto';
import { Order } from '#modules/nantralpay/types/order.type';
import { useFilters } from '#pages/NantralPay/hooks/useFilters';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { Page, PageDTO } from '#shared/infra/pagination';

import { OrderTable } from '../components/OrderTable';

export default function OrderListTab() {
  const { t } = useTranslation();

  const [filters, updateFilters] = useFilters();

  const { data, isLoading, isFetching, isSuccess } = useQuery<
    PageDTO<OrderDTO>,
    ApiError,
    Page<Order>
  >({
    queryKey: ['orders'],
    queryFn: () => getOrderListApi(),
  });
  return (
    <>
      <Typography variant={'h2'}>{t('nantralpay.oderList.title')}</Typography>
      <Spacer vertical={2} />
      <OrderTable
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isSuccess={isSuccess}
        filters={filters}
        updateFilters={updateFilters}
      />
    </>
  );
}
