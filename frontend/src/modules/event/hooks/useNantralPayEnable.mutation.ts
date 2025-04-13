import {
  InfiniteData,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { Event } from '#modules/event/event.type';
import {
  disableNantralPayEventApi,
  enableNantralPayEventApi,
} from '#modules/nantralpay/api/setNantralPayEventStatus.api';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

type OptionsType = UseMutationOptions<number, ApiError, number>;

export function useNantralPayEnableMutation(eventId: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const showToast = useToast();

  const enableMutation = useMutation<number, ApiError, number>(
    enableNantralPayEventApi,
  );
  const disableMutation = useMutation<number, ApiError, number>(
    disableNantralPayEventApi,
  );

  const updateCachedQueries = (newData: Partial<Event>) => {
    // update data NOW so that it is displayed to the user
    queryClient.setQueriesData(
      ['events', 'infiniteList'],
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
      ['event', { id: eventId }],
      (data?: Event) =>
        data && {
          ...data,
          ...newData,
        },
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries(['events']);
    queryClient.invalidateQueries(['event', { id: eventId }]);
  };

  const enable = ({ onSuccess, onError, ...options }: OptionsType) => {
    enableMutation.mutate(eventId, {
      onSuccess: (...args) => {
        showToast({
          message: t('event.nantralpay.enable.success'),
          variant: 'success',
        });
        updateCachedQueries({ nantralpayIsOpen: true });
        return onSuccess?.(...args);
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

  const disable = ({ onSuccess, onError, ...options }: OptionsType) => {
    disableMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // show a confirmation
        showToast({
          message: t('event.nantralpay.disable.success'),
          variant: 'success',
        });
        updateCachedQueries({ nantralpayIsOpen: false });
        return onSuccess?.(...args);
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
    enable: enable,
    disable: disable,
    isLoading: enableMutation.isLoading || disableMutation.isLoading,
    isError: enableMutation.isError || disableMutation.isError,
    error: enableMutation.error || disableMutation.error,
  };
}
