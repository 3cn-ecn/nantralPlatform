import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { isSameMinute, roundToNearestMinutes } from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { EventDTO } from '#modules/event/infra/event.dto';
import { OrderingField } from '#shared/infra/orderingFields.types';
import {
  convertCamelToSnakeCase,
  convertToURLSearchParams,
  parseDate,
  parseNullBool,
  parseString,
} from '#shared/utils/queryParamsParsers';

function parseQueryParams(queryParams: URLSearchParams): EventListQueryParams {
  const filters = {
    group: queryParams.getAll('group'),
    fromDate: parseDate(queryParams.get('from_date')),
    toDate: parseDate(queryParams.get('to_date')),
    isMember: parseNullBool(queryParams.get('is_member')),
    isShotgun: parseNullBool(queryParams.get('is_shotgun')),
    isBookmarked: parseNullBool(queryParams.get('is_bookmarked')),
    isParticipating: parseNullBool(queryParams.get('is_participating')),
    isRegistrationOpen: parseNullBool(queryParams.get('is_registration_open')),
    search: parseString(queryParams.get('search')),
    ordering: parseString(
      queryParams.get('ordering')
    ) as OrderingField<EventDTO>,
  };
  if (!filters.fromDate && !filters.toDate) {
    filters.fromDate = roundToNearestMinutes(new Date());
  }

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
    (newFilter: Partial<EventListQueryParams>) => {
      const convertedFilter = convertCamelToSnakeCase({
        ...newFilter,
        // handle fromDate differently to hide it from params when equals to now
        ...(newFilter.fromDate && isSameMinute(newFilter.fromDate, new Date())
          ? { fromDate: null }
          : {}),
      });
      const params = convertToURLSearchParams(convertedFilter);
      setQueryParams(params, { preventScrollReset: true });
    },
    [setQueryParams]
  );

  const updateFilters = useCallback(
    (newFilter: Partial<EventListQueryParams>) => {
      setFilters({ ...filters, ...newFilter });
    },
    [filters, setFilters]
  );

  const resetFilters = useCallback(() => setFilters({}), [setFilters]);

  return [filters, updateFilters, resetFilters] as const;
}
