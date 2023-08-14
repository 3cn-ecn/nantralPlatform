import {
  InfiniteData,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from 'react-query';

import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { markNotificationAsSeenApi } from '../api/markNotificationAsSeen.api';
import { markNotificationAsUnseenApi } from '../api/markNotificationAsUnseen.api';
import { SentNotification } from '../notification.types';

type OptionsType = UseMutationOptions<number, ApiError, number>;

export function useMarkAsSeenMutation(notificationId: number) {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const markAsSeenMutation = useMutation<number, ApiError, number>(
    markNotificationAsSeenApi
  );
  const markAsUnseenMutation = useMutation<number, ApiError, number>(
    markNotificationAsUnseenApi
  );

  const updateCachedQueries = (newData: Partial<SentNotification>) => {
    // update data NOW so that it is displayed to the user
    queryClient.setQueriesData(
      ['notifications', 'list'],
      (data?: InfiniteData<Page<SentNotification>>) =>
        data && {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            results: page.results.map((e) =>
              e.id === notificationId ? { ...e, ...newData } : e
            ),
          })),
        }
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries(['notifications']);
  };

  const markAsSeen = ({ onSuccess, onError, ...options }: OptionsType = {}) => {
    markAsSeenMutation.mutate(notificationId, {
      onSuccess: (...args) => {
        updateCachedQueries({ seen: true });
        if (onSuccess) return onSuccess(...args);
      },
      onError: (error, variables, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries({});
        if (onError) return onError(error, variables, context);
      },
      ...options,
    });
  };

  const markAsUnseen = ({
    onSuccess,
    onError,
    ...options
  }: OptionsType = {}) => {
    markAsUnseenMutation.mutate(notificationId, {
      onSuccess: (...args) => {
        updateCachedQueries({ seen: false });
        if (onSuccess) return onSuccess(...args);
      },
      onError: (error, variables, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries({});
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
