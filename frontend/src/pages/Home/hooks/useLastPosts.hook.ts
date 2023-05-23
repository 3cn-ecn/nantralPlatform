import { useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';

export function useLastPosts() {
  const today = new Date();
  const numberOfDays = 15;
  const fromDate = new Date();
  fromDate.setDate(today.getDay() - numberOfDays);

  const { data, refetch, ...rest } = useQuery({
    queryKey: ['posts', { pinned: false, numberOfDays: numberOfDays }],
    queryFn: () =>
      getPostList({
        pinned: false,
        fromDate: fromDate,
      }),
  });

  return {
    lastPosts: data,
    refetchLastPosts: refetch,
    ...rest,
  };
}
