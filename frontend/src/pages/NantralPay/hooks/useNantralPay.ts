import { useQuery } from '@tanstack/react-query';

import { getNantralPayUserApi } from '#modules/nantralpay/api/getNantralPayUser.api';
import { getPaymentListApi } from '#modules/nantralpay/api/getPaymentList.api';
import { getTransactionListApi } from '#modules/nantralpay/api/getTransactionList.api';
import { NantralPayUser } from '#modules/nantralpay/types/nantralpayUser.type';
import { PaymentPreview } from '#modules/nantralpay/types/payment.type';
import { TransactionPreview } from '#modules/nantralpay/types/transaction.type';
import { useAuth } from '#shared/context/Auth.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useNantralPay() {
  const { isAuthenticated } = useAuth();

  const userQuery = useQuery<NantralPayUser, ApiError>({
    queryFn: () => getNantralPayUserApi(),
    queryKey: ['nantralpayUser'],
  });

  const transactionQuery = useQuery<Page<TransactionPreview>, ApiError>({
    queryFn: () => getTransactionListApi(),
    queryKey: ['transactions'],
    enabled: isAuthenticated,
  });

  const paymentsQuery = useQuery<Page<PaymentPreview>, ApiError>({
    queryFn: () => getPaymentListApi(),
    queryKey: ['payments'],
    enabled: isAuthenticated,
  });

  return {
    nantralpayUser: userQuery.data,
    transactions: transactionQuery.data,
    payments: paymentsQuery.data,
    isLoading:
      userQuery.isLoading ||
      transactionQuery.isLoading ||
      paymentsQuery.isLoading,
    isError:
      userQuery.isError || transactionQuery.isError || paymentsQuery.isError,
    isFetching:
      userQuery.isFetching ||
      transactionQuery.isFetching ||
      paymentsQuery.isFetching,
    refetch: () => {
      userQuery.refetch();
      transactionQuery.refetch();
      paymentsQuery.refetch();
    },
    error: userQuery.error || transactionQuery.error || paymentsQuery.error,
    isSuccess:
      userQuery.isSuccess &&
      transactionQuery.isSuccess &&
      paymentsQuery.isSuccess,
  };
}
