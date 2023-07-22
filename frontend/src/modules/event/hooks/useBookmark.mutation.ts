import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { addBookmark } from '../api/addBookmark';
import { removeBookmark } from '../api/removeBookmark';
import { Event } from '../event.type';

type OptionsType = UseMutationOptions<number, ApiError, number>;

export function useBookmarkMutation(eventId: number) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation<number, ApiError, number>(removeBookmark);
  const addMutation = useMutation<number, ApiError, number>(addBookmark);

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

  const addBookmarkMutate = ({ onSuccess, ...options }: OptionsType) => {
    addMutation.mutate(eventId, {
      onSuccess: (...args) => {
        updateCachedQueries({ isBookmarked: true });
        if (onSuccess) return onSuccess(...args);
      },
      ...options,
    });
  };

  const removeBookmarkMutate = ({ onSuccess, ...options }: OptionsType) => {
    removeMutation.mutate(eventId, {
      onSuccess: (...args) => {
        updateCachedQueries({ isBookmarked: false });
        if (onSuccess) return onSuccess(...args);
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
