import { Typography } from '@mui/material';

import { TransactionPreview } from '#modules/nantralpay/types/transaction.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { TransactionTable } from '../components/TransactionTable';
import { useFilters } from '../hooks/useFilters';

export default function TransactionListTab({
  transactions,
  isLoading,
  isSuccess,
  isFetching,
}: {
  transactions: Page<TransactionPreview>;
  isLoading: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}) {
  const { t } = useTranslation();

  const [filters, updateFilters] = useFilters();

  return (
    <>
      <Typography variant="h2">{t('nantralpay.transaction.list')}</Typography>
      <TransactionTable
        data={transactions}
        updateFilters={updateFilters}
        filters={filters}
        isSuccess={isSuccess}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </>
  );
}
