import { useState } from 'react';

import { History } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { roundToNearestMinutes, isSameDay } from 'date-fns/fp';

import { EventListQueryParams } from '#modules/event/api/getEventList.api';
import { CreateEventModal } from '#modules/event/view/Modals/CreateEventModal';
import { Group } from '#modules/group/types/group.types';
import { EventInfiniteGrid } from '#pages/Event/EventGrid/EventInfiniteGrid';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateButton } from '../components/Buttons/CreateButton';

export function GroupEvents({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  const now = roundToNearestMinutes(new Date());
  const { t } = useTranslation();
  const [filters, setFilters] = useState<EventListQueryParams>({
    group: [group.slug],
    ordering: '-start_date',
    fromDate: now,
    toDate: null,
  });
  const filterIsPastEvents =
    filters.fromDate === null &&
    filters.toDate &&
    isSameDay(filters.toDate, now);

  function updateFilters(newFilters: EventListQueryParams) {
    setFilters({ ...filters, ...newFilters });
  }

  return (
    <>
      <FlexRow pb={2} justifyContent={'space-between'} alignItems={'center'}>
        <Chip
          icon={<History />}
          label={t('event.filters.pastEvents')}
          variant={filterIsPastEvents ? 'filled' : 'outlined'}
          color={filterIsPastEvents ? 'secondary' : 'default'}
          onClick={() =>
            filterIsPastEvents
              ? updateFilters({
                  fromDate: now,
                  toDate: null,
                  ordering: 'start_date',
                })
              : updateFilters({
                  fromDate: null,
                  toDate: now,
                  ordering: '-start_date',
                })
          }
        />
        {group.isAdmin && <CreateButton onClick={() => setOpen(true)} />}
      </FlexRow>
      <EventInfiniteGrid filters={filters} />
      {open && (
        <CreateEventModal
          onClose={() => setOpen(false)}
          onCreated={() => setOpen(false)}
          group={group}
        />
      )}
    </>
  );
}
