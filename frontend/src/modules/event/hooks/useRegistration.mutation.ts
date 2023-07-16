import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiErrorDTO } from '#shared/infra/errors';

import { registerAsParticipant } from '../api/registerAsParticipant';
import { unregisterAsParticipant } from '../api/unregisterAsParticipant';

type OptionsType = UseMutationOptions<number, ApiErrorDTO, number>;

export function useRegistrationMutation(eventId: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const registerMutation = useMutation<number, ApiErrorDTO, number>(
    registerAsParticipant
  );
  const unregisterMutation = useMutation<number, ApiErrorDTO, number>(
    unregisterAsParticipant
  );

  const register = ({ onSuccess, ...options }: OptionsType) => {
    registerMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // show a confirmation
        showToast({
          message: t('event.registration.register.success'),
          variant: 'success',
        });
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries('events');
        queryClient.invalidateQueries(['event', { id: eventId }]);
        return onSuccess(...args);
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
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries('events');
        queryClient.invalidateQueries(['event', { id: eventId }]);
        return onSuccess(...args);
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
