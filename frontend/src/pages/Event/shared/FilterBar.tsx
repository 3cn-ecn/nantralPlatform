import { Dispatch, SetStateAction } from 'react';

import {
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
  FilterList as FilterListIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Badge, Chip } from '@mui/material';
import { isSameDay, roundToNearestMinutes } from 'date-fns';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { FilterDrawer } from './FilterDrawer';

interface FilterBarProps {
  filters: EventListQueryParams;
  updateFilters: (filters: Partial<EventListQueryParams>) => void;
  resetFilters: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  noDates?: boolean;
}

export function FilterBar({
  filters,
  updateFilters,
  resetFilters,
  isDrawerOpen,
  setIsDrawerOpen,
  noDates = false,
}: FilterBarProps) {
  const { t } = useTranslation();
  const { isLarger: isLargeScreen } = useBreakpoint('sm');

  const now = roundToNearestMinutes(new Date());

  const filterIsPastEvents =
    filters.toDate && isSameDay(filters.toDate, now) && !filters.fromDate;

  const showBadge =
    (!noDates &&
      ((filters.fromDate && !isSameDay(filters.fromDate, now)) ||
        filters.toDate)) ||
    filters.isShotgun ||
    filters.group?.length;

  return (
    <FlexRow gap={1} flexWrap="wrap">
      <Chip
        icon={<CheckCircleIcon />}
        label={t('event.filters.isParticipating')}
        variant={filters.isParticipating ? 'filled' : 'outlined'}
        color={filters.isParticipating ? 'secondary' : 'default'}
        onClick={() =>
          updateFilters({
            isParticipating: filters.isParticipating ? undefined : true,
          })
        }
      />
      <Chip
        icon={<FavoriteIcon />}
        label={t('event.filters.isBookmarked')}
        variant={filters.isBookmarked ? 'filled' : 'outlined'}
        color={filters.isBookmarked ? 'secondary' : 'default'}
        onClick={() =>
          updateFilters({
            isBookmarked: filters.isBookmarked ? undefined : true,
          })
        }
      />
      {isLargeScreen && !noDates && (
        <Chip
          icon={<HistoryIcon />}
          label={t('event.filters.pastEvents')}
          variant={filterIsPastEvents ? 'filled' : 'outlined'}
          color={filterIsPastEvents ? 'secondary' : 'default'}
          onClick={() =>
            filterIsPastEvents
              ? updateFilters({ fromDate: null, toDate: null })
              : updateFilters({ fromDate: null, toDate: now })
          }
        />
      )}
      <Chip
        icon={<FilterListIcon />}
        label={
          showBadge ? (
            <Badge variant="dot" color="warning">
              {t('event.filters.more')}
            </Badge>
          ) : (
            t('event.filters.more')
          )
        }
        sx={{ '& > .MuiChip-label': { overflow: 'visible' } }}
        variant="outlined"
        onClick={() => setIsDrawerOpen(true)}
      />
      <FilterDrawer
        filters={filters}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        noDates={noDates}
      />
    </FlexRow>
  );
}
