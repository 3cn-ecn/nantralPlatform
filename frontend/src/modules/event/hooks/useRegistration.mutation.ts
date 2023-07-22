import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

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

  const registerMutation = useMutation<number, ApiError, number>(
    registerAsParticipantApi
  );
  const unregisterMutation = useMutation<number, ApiError, number>(
    unregisterAsParticipantApi
  );

  const updateCachedQueries = (newData: Partial<Event>) => {
    // update data NOW so that it is displayed to the user
    queryClient.setQueriesData(
      ['events'],
      (eventListObj?: Page<Event>) =>
        eventListObj && {
          ...eventListObj,
          results: eventListObj.results.map((e) =>
            e.id === eventId ? { ...e, ...newData } : e
          ),
        }
    );
    queryClient.setQueriesData(
      ['event', { id: eventId }],
      (event?: Event) =>
        event && {
          ...event,
          ...newData,
        }
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries(['events']);
    queryClient.invalidateQueries(['event', { id: eventId }]);
  };

  const register = ({ onSuccess, ...options }: OptionsType) => {
    registerMutation.mutate(eventId, {
      onSuccess: (...args) => {
        showToast({
          message: t('event.registration.register.success'),
          variant: 'success',
        });
        updateCachedQueries({ isParticipating: true });
        if (onSuccess) return onSuccess(...args);
      },
      ...options,
    });
  };

  const unregister = ({ onSuccess, ...options }: OptionsType) => {
    unregisterMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // show a confirmation
        showToast({
          message: t('event.registration.unregister.success'),
          variant: 'success',
        });
        updateCachedQueries({ isParticipating: false });
        if (onSuccess) return onSuccess(...args);
      },
      ...options,
    });
  };

  return {
    register,
    unregister,
    isLoading: registerMutation.isLoading || unregisterMutation.isLoading,
    isError: registerMutation.isError || unregisterMutation.isError,
    error: registerMutation.error || unregisterMutation.error,
  };
}
