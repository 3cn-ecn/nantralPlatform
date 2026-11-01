import {
  InfiniteData,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { markAllNotificationsAsSeenApi } from '../api/markAllNotificationsAsSeen.api';
import { SentNotification } from '../notification.types';

type OptionsType = UseMutationOptions<number, ApiError, void>;

export function useMarkAllAsSeenMutation() {
  const queryClient = useQueryClient();
  const showToast = useToast();

  const markAllAsSeenMutation = useMutation<number, ApiError>({
    mutationFn: markAllNotificationsAsSeenApi,
  });

  const markAllAsSeen = ({
    onSuccess,
    onError,
    ...options
  }: OptionsType = {}) => {
    markAllAsSeenMutation.mutate(undefined, {
      onSuccess: (...args) => {
        queryClient.setQueriesData(
          { queryKey: ['notifications', 'list'] },
          (data?: InfiniteData<Page<SentNotification>>) =>
            data && {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                results: page.results.map((e) => ({ ...e, seen: true })),
              })),
            },
        );
        queryClient.setQueriesData(
          { queryKey: ['notifications', 'count', { seen: false }] },
          () => 0,
        );
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries({
          queryKey: ['notifications'],
        });
        return onSuccess?.(...args);
      },
      onError: (error, variables, onMutateResult, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        if (onError) return onError(error, variables, onMutateResult, context);
      },
      ...options,
    });
  };

  return {
    markAllAsSeen,
    ...markAllAsSeenMutation,
  };
}
