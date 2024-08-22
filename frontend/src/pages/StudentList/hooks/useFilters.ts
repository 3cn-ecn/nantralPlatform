import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  convertCamelToSnakeCase,
  convertToURLSearchParams,
  parseNumber,
  parseString,
} from '#shared/utils/queryParamsParsers';

export interface StudentListQueryParams {
  promo?: number;
  search?: string;
  page: number;
  pageSize: number;
  path?: string;
  faculty?: string;
}

function parseQueryParams(
  queryParams: URLSearchParams,
): StudentListQueryParams {
  const filters = {
    promo: parseNumber(queryParams.get('promo')) ?? undefined,
    page: parseNumber(queryParams.get('page')) ?? 1,
    pageSize: parseNumber(queryParams.get('page_size')) ?? 30,
    search: parseString(queryParams.get('search')) ?? undefined,
    ordering: parseString(queryParams.get('ordering')) ?? undefined,
    path: parseString(queryParams.get('path')) ?? undefined,
    faculty: parseString(queryParams.get('faculty')) ?? undefined,
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
    (newFilter: Partial<StudentListQueryParams>) => {
      const convertedFilter = convertCamelToSnakeCase({
        ...newFilter,
      });
      const params = convertToURLSearchParams(convertedFilter);
      setQueryParams(params, { preventScrollReset: true });
    },
    [setQueryParams],
  );

  const updateFilters = useCallback(
    (newFilter: Partial<StudentListQueryParams>) => {
      setFilters({ ...filters, ...newFilter });
    },
    [filters, setFilters],
  );

  const resetFilters = useCallback(
    () =>
      setFilters({
        promo: undefined,
        faculty: undefined,
        page: 1,
        path: undefined,
      }),
    [setFilters],
  );

  return [filters, updateFilters, resetFilters] as const;
}
