import { Typography } from '@mui/material';

import { PaymentPreview } from '#modules/nantralpay/types/payment.type';
import { PaymentTable } from '#pages/NantralPay/components/PaymentTable';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { useFilters } from '../hooks/useFilters';

export default function PaymentListTab({
  payments,
  isLoading,
  isSuccess,
  isFetching,
}: {
  payments: Page<PaymentPreview>;
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}) {
  const { t } = useTranslation();

  const [filters, updateFilters] = useFilters();

  return (
    <>
      <Typography variant="h2">{t('nantralpay.payment.list')}</Typography>
      <PaymentTable
        data={payments}
        updateFilters={updateFilters}
        filters={filters}
        isLoading={isLoading}
        isFetching={isFetching}
        isSuccess={isSuccess}
      />
    </>
  );
}
