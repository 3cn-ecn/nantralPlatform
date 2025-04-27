import { useQuery } from '@tanstack/react-query';

import { getNantralPayUserApi } from '#modules/nantralpay/api/getNantralPayUser.api';
import { getOrderListApi } from '#modules/nantralpay/api/getOrderList.api';
import { getTransactionListApi } from '#modules/nantralpay/api/getTransactionList.api';
import { NantralPayUser } from '#modules/nantralpay/types/nantralpayUser.type';
import { Order } from '#modules/nantralpay/types/order.type';
import { Transaction } from '#modules/nantralpay/types/transaction.type';
import { useAuth } from '#shared/context/Auth.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

export function useNantralPay() {
  const { isAuthenticated } = useAuth();

  const userQuery = useQuery<NantralPayUser, ApiError>({
    queryFn: () => getNantralPayUserApi(),
    queryKey: ['nantralpayUser'],
  });

  const transactionQuery = useQuery<Page<Transaction>, ApiError>({
    queryFn: () => getTransactionListApi(),
    queryKey: ['transactions'],
    enabled: isAuthenticated,
  });

  const ordersQuery = useQuery<Page<Order>, ApiError>({
    queryFn: () => getOrderListApi(),
    queryKey: ['payments'],
    enabled: isAuthenticated,
  });

  return {
    nantralpayUser: userQuery.data,
    transactions: transactionQuery.data,
    payments: ordersQuery.data,
    isLoading:
      userQuery.isLoading ||
      transactionQuery.isLoading ||
      ordersQuery.isLoading,
    isError:
      userQuery.isError || transactionQuery.isError || ordersQuery.isError,
    isFetching:
      userQuery.isFetching ||
      transactionQuery.isFetching ||
      ordersQuery.isFetching,
    refetch: () => {
      userQuery.refetch();
      transactionQuery.refetch();
      ordersQuery.refetch();
    },
    error: userQuery.error || transactionQuery.error || ordersQuery.error,
    isSuccess:
      userQuery.isSuccess &&
      transactionQuery.isSuccess &&
      ordersQuery.isSuccess,
  };
}
