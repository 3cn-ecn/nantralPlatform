import { PropsWithChildren, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { UseInfiniteQueryResult } from '@tanstack/react-query';

type InfiniteListProps = PropsWithChildren<{ query: UseInfiniteQueryResult }>;

/**
 * Component to automatically fetch next pages when scrolling
 * @returns
 */
export function InfiniteList({ query, children }: InfiniteListProps) {
  const { inView, ref } = useInView();
  const { fetchNextPage, hasNextPage } = query;

  useEffect(() => {
    // fetch data in cascade if the div is inView
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      {children}
      <div ref={ref}></div>
    </>
  );
}
