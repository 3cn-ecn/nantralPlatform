import {
  InfiniteData,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from 'react-query';

import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { markAllNotificationsAsSeenApi } from '../api/markAllNotificationsAsSeen.api';
import { SentNotification } from '../notification.types';

type OptionsType = UseMutationOptions<number, ApiError, void>;

export function useMarkAllAsSeenMutation() {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const markAllAsSeenMutation = useMutation<number, ApiError, void>(
    markAllNotificationsAsSeenApi
  );

  const markAllAsSeen = ({
    onSuccess,
    onError,
    ...options
  }: OptionsType = {}) => {
    markAllAsSeenMutation.mutate(undefined, {
      onSuccess: (...args) => {
        queryClient.setQueriesData(
          ['notifications', 'list'],
          (data?: InfiniteData<Page<SentNotification>>) =>
            data && {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                results: page.results.map((e) => ({ ...e, seen: true })),
              })),
            }
        );
        queryClient.setQueriesData(
          ['notifications', 'count', { seen: false }],
          () => 0
        );
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries(['notifications']);
        if (onSuccess) return onSuccess(...args);
      },
      onError: (error, variables, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        if (onError) return onError(error, variables, context);
      },
      ...options,
    });
  };

  return {
    markAllAsSeen,
    ...markAllAsSeenMutation,
  };
}
