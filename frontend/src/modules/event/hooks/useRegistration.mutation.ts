import {
  InfiniteData,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { registerAsParticipantApi } from '../api/registerAsParticipant.api';
import { unregisterAsParticipantApi } from '../api/unregisterAsParticipant.api';
import { Event } from '../event.type';

type OptionsType = UseMutationOptions<number, ApiError, number>;

export function useRegistrationMutation(eventId: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const showToast = useToast();

  const registerMutation = useMutation<number, ApiError, number>({
    mutationFn: registerAsParticipantApi,
  });
  const unregisterMutation = useMutation<number, ApiError, number>({
    mutationFn: unregisterAsParticipantApi,
  });

  const updateCachedQueries = (newData: Partial<Event>) => {
    // update data NOW so that it is displayed to the user
    queryClient.setQueriesData(
      { queryKey: ['events', 'infiniteList'] },
      (data?: InfiniteData<Page<Event>>) =>
        data && {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            results: page.results.map((e) =>
              e.id === eventId ? { ...e, ...newData } : e,
            ),
          })),
        },
    );
    queryClient.setQueriesData(
      {
        queryKey: ['events'],
        predicate: (query) => query.queryKey[1] !== 'infiniteList',
      },
      (data?: Page<Event>) =>
        data && {
          ...data,
          results: data.results.map((e) =>
            e.id === eventId ? { ...e, ...newData } : e,
          ),
        },
    );
    queryClient.setQueriesData(
      { queryKey: ['event', { id: eventId }] },
      (data?: Event) =>
        data && {
          ...data,
          ...newData,
        },
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries({
      queryKey: ['events'],
    });
    queryClient.invalidateQueries({
      queryKey: ['event', { id: eventId }],
    });
  };

  const register = ({ onSuccess, onError, ...options }: OptionsType) => {
    registerMutation.mutate(eventId, {
      onSuccess: (...args) => {
        showToast({
          message: t('event.registration.register.success'),
          variant: 'success',
        });
        updateCachedQueries({ isParticipating: true });
        return onSuccess?.(...args);
      },
      onError: (error, variables, onMutateResult, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries({});
        if (onError) return onError(error, variables, onMutateResult, context);
      },
      ...options,
    });
  };

  const unregister = ({ onSuccess, onError, ...options }: OptionsType) => {
    unregisterMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // show a confirmation
        showToast({
          message: t('event.registration.unregister.success'),
          variant: 'success',
        });
        updateCachedQueries({ isParticipating: false });
        return onSuccess?.(...args);
      },
      onError: (error, variables, onMutateResult, context) => {
        showToast({
          message: error.message,
          variant: 'error',
        });
        updateCachedQueries({});
        if (onError) return onError(error, variables, onMutateResult, context);
      },
      ...options,
    });
  };

  return {
    register,
    unregister,
    isPending: registerMutation.isPending || unregisterMutation.isPending,
    isError: registerMutation.isError || unregisterMutation.isError,
    error: registerMutation.error || unregisterMutation.error,
  };
}
