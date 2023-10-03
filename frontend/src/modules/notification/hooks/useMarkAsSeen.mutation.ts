import {
  InfiniteData,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { markNotificationAsSeenApi } from '../api/markNotificationAsSeen.api';
import { markNotificationAsUnseenApi } from '../api/markNotificationAsUnseen.api';
import { SentNotification } from '../notification.types';

type OptionsType = UseMutationOptions<number, ApiError, number> & {
  notificationId?: number;
};

export function useMarkAsSeenMutation(defaultNotificationId?: number) {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const markAsSeenMutation = useMutation<number, ApiError, number>(
    markNotificationAsSeenApi,
  );
  const markAsUnseenMutation = useMutation<number, ApiError, number>(
    markNotificationAsUnseenApi,
  );

  const updateCachedQueries = (
    notificationId: number,
    newData: Partial<SentNotification>,
  ) => {
    // update data NOW so that it is displayed to the user
    queryClient.setQueriesData(
      ['notifications', 'list'],
      (data?: InfiniteData<Page<SentNotification>>) =>
        data && {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            results: page.results.map((e) =>
              e.id === notificationId ? { ...e, ...newData } : e,
            ),
          })),
        },
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries(['notifications']);
  };

  const markAsSeen = ({
    onSuccess,
    onError,
    notificationId,
    ...options
  }: OptionsType = {}) => {
    const id = notificationId || defaultNotificationId;
    if (id === undefined) {
      throw new Error('You must provide a notification id.');
    }
    markAsSeenMutation.mutate(id, {
      onSuccess: (...args) => {
        updateCachedQueries(id, { seen: true });
        return onSuccess?.(...args);
      },
      onError: (error, variables, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries(id, {});
        if (onError) return onError(error, variables, context);
      },
      ...options,
    });
  };

  const markAsUnseen = ({
    onSuccess,
    onError,
    notificationId,
    ...options
  }: OptionsType = {}) => {
    const id = notificationId || defaultNotificationId;
    if (id === undefined) {
      throw new Error('You must provide a notification id.');
    }
    markAsUnseenMutation.mutate(id, {
      onSuccess: (...args) => {
        updateCachedQueries(id, { seen: false });
        return onSuccess?.(...args);
      },
      onError: (error, variables, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries(id, {});
        if (onError) return onError(error, variables, context);
      },
      ...options,
    });
  };

  return {
    markAsSeen,
    markAsUnseen,
    isLoading: markAsSeenMutation.isLoading || markAsUnseenMutation.isLoading,
    isError: markAsSeenMutation.isError || markAsUnseenMutation.isError,
    error: markAsSeenMutation.error || markAsUnseenMutation.error,
  };
}
