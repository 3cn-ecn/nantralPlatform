import { useState } from 'react';
import { useQuery } from 'react-query';

import { getPostList } from '#modules/post/api/getPostList';

export function useLastPostsQuery() {
  const [page, setPage] = useState(1);

  const today = new Date();
  const numberOfDays = 15;
  const fromDate = new Date();
  fromDate.setDate(today.getDay() - numberOfDays);

  const { data, ...rest } = useQuery({
    queryKey: ['posts', 'last-posts', page],
    queryFn: () =>
      getPostList({
        pinned: false,
        fromDate: fromDate,
        page: page,
        pageSize: 3,
      }),
    keepPreviousData: true,
  });

  return {
    lastPosts: data && data.results,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
