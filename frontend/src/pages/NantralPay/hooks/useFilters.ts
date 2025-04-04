import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  convertCamelToSnakeCase,
  convertToURLSearchParams,
  parseNumber,
  parseString,
} from '#shared/utils/queryParamsParsers';

export interface TransactionListQueryParams {
  group?: string;
  search?: string;
  page: number;
  pageSize: number;
}

function parseQueryParams(
  queryParams: URLSearchParams,
): TransactionListQueryParams {
  const filters = {
    group: parseString(queryParams.get('group')) ?? undefined,
    page: parseNumber(queryParams.get('page')) ?? 1,
    pageSize: parseNumber(queryParams.get('page_size')) ?? 25,
    search: parseString(queryParams.get('search')) ?? undefined,
    ordering: parseString(queryParams.get('ordering')) ?? undefined,
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
    (newFilter: Partial<TransactionListQueryParams>) => {
      const convertedFilter = convertCamelToSnakeCase({
        ...newFilter,
      });
      const params = convertToURLSearchParams(convertedFilter);
      setQueryParams(params, { preventScrollReset: true });
    },
    [setQueryParams],
  );

  const updateFilters = useCallback(
    (newFilter: Partial<TransactionListQueryParams>) => {
      setFilters({ ...filters, ...newFilter });
    },
    [filters, setFilters],
  );

  const resetFilters = useCallback(
    () =>
      setFilters({
        group: undefined,
        page: 1,
      }),
    [setFilters],
  );

  return [filters, updateFilters, resetFilters] as const;
}
