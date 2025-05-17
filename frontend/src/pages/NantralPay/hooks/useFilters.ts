import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  convertCamelToSnakeCase,
  convertToURLSearchParams,
  parseNumber,
} from '#shared/utils/queryParamsParsers';

export interface OrderListQueryParams {
  page: number;
  pageSize: number;
}

function parseQueryParams(
  queryParams: URLSearchParams,
): OrderListQueryParams {
  const filters = {
    page: parseNumber(queryParams.get('page')) ?? 1,
    pageSize: parseNumber(queryParams.get('page_size')) ?? 25,
  };

  return filters;
}

/**
 * A hook to manipulate filters and sync them with the query params
 * @returns [filters, setFilters]
 */
export function useFilters() {
  const [queryParams, setQueryParams] = useSearchParams();

  // do not use a state for filter, since queryParams is already a state
  const filters = useMemo(() => parseQueryParams(queryParams), [queryParams]);

  const setFilters = useCallback(
    (newFilter: Partial<OrderListQueryParams>) => {
      const convertedFilter = convertCamelToSnakeCase({
        ...newFilter,
      });
      const params = convertToURLSearchParams(convertedFilter);
      setQueryParams(params, { preventScrollReset: true });
    },
    [setQueryParams],
  );

  const updateFilters = useCallback(
    (newFilter: Partial<OrderListQueryParams>) => {
      setFilters({ ...filters, ...newFilter });
    },
    [filters, setFilters],
  );

  const resetFilters = useCallback(
    () =>
      setFilters({
        page: 1,
      }),
    [setFilters],
  );

  return [filters, updateFilters, resetFilters] as const;
}
