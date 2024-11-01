import { useQueryParamState } from '#shared/hooks/useQueryParamState';

export function usePostQueryParamState() {
  const [value, setValue] = useQueryParamState<number | null>(
    'post',
    null,
    Number.parseInt,
  );

  return {
    postId: value,
    setPostId: (postId: number) => setValue(postId),
    closePost: () => setValue(null),
  };
}
