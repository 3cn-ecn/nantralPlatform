import {
  InfiniteData,
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from 'react-query';

import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';

import { addBookmarkApi } from '../api/addBookmark.api';
import { removeBookmarkApi } from '../api/removeBookmark.api';
import { Event } from '../event.type';

type OptionsType = UseMutationOptions<number, ApiError, number>;

export function useBookmarkMutation(eventId: number) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation<number, ApiError, number>(
    removeBookmarkApi
  );
  const addMutation = useMutation<number, ApiError, number>(addBookmarkApi);

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
              e.id === eventId ? { ...e, ...newData } : e
            ),
          })),
        }
    );
    queryClient.setQueriesData(
      {
        queryKey: 'events',
        predicate: (query) => query.queryKey[1] !== 'infiniteList',
      },
      (data?: Page<Event>) =>
        data && {
          ...data,
          results: data.results.map((e) =>
            e.id === eventId ? { ...e, ...newData } : e
          ),
        }
    );
    queryClient.setQueriesData(
      ['event', { id: eventId }],
      (data?: Event) =>
        data && {
          ...data,
          ...newData,
        }
    );
    // invalidate queries to force reload the queries we have modified
    queryClient.invalidateQueries(['events']);
    queryClient.invalidateQueries(['event', { id: eventId }]);
  };

  const addBookmark = ({ onSuccess, ...options }: OptionsType) => {
    addMutation.mutate(eventId, {
      onSuccess: (...args) => {
        updateCachedQueries({ isBookmarked: true });
        return onSuccess?.(...args);
      },
      ...options,
    });
  };

  const removeBookmark = ({ onSuccess, ...options }: OptionsType) => {
    removeMutation.mutate(eventId, {
      onSuccess: (...args) => {
        updateCachedQueries({ isBookmarked: false });
        return onSuccess?.(...args);
      },
      ...options,
    });
  };

  return {
    addBookmark,
    removeBookmark,
    isLoading: removeMutation.isLoading || addMutation.isLoading,
    isError: removeMutation.isError || addMutation.isError,
    error: removeMutation.error || addMutation.error,
  };
}
