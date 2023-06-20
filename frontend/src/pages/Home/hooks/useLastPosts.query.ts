import { useState } from 'react';
import { useQuery } from 'react-query';

import { sub as subtractDates } from 'date-fns';

import { getPostList } from '#modules/post/api/getPostList';

export function useLastPostsQuery() {
  const [page, setPage] = useState(1);

  const today = new Date();
  const minDate = subtractDates(today, { days: 15 });

  const { data, ...rest } = useQuery({
    queryKey: ['posts', 'last-posts', page],
    queryFn: () =>
      getPostList({
        pinned: false,
        minDate: minDate,
        page: page,
        pageSize: 3,
      }),
  });

  return {
    lastPosts: data && data.results,
    numPages: data && data.numPages,
    page,
    setPage,
    ...rest,
  };
}
