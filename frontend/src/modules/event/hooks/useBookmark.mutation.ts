import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

import { ApiErrorDTO } from '#shared/infra/errors';

import { addBookmark } from '../api/addBookmark';
import { removeBookmark } from '../api/removeBookmark';

type OptionsType = UseMutationOptions<number, ApiErrorDTO, number>;

export function useBookmarkMutation(eventId: number) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation<number, ApiErrorDTO, number>(
    removeBookmark
  );
  const addMutation = useMutation<number, ApiErrorDTO, number>(addBookmark);

  const addBookmarkMutate = ({ onSuccess, ...options }: OptionsType) => {
    addMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries('events');
        queryClient.invalidateQueries(['event', { id: eventId }]);
        return onSuccess(...args);
      },
      ...options,
    });
  };

  const removeBookmarkMutate = ({ onSuccess, ...options }: OptionsType) => {
    removeMutation.mutate(eventId, {
      onSuccess: (...args) => {
        // invalidate queries to force reload the queries we have modified
        queryClient.invalidateQueries('events');
        queryClient.invalidateQueries(['event', { id: eventId }]);
        return onSuccess(...args);
      },
      ...options,
    });
  };

  return {
    addBookmark: addBookmarkMutate,
    removeBookmark: removeBookmarkMutate,
    isLoading: removeMutation.isLoading || addMutation.isLoading,
    isError: removeMutation.isError || addMutation.isError,
    error: removeMutation.error || addMutation.error,
  };
}
