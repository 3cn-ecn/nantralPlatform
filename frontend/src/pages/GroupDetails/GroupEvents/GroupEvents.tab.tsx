import { useState } from 'react';

import { CreateEventModal } from '#modules/event/view/Modals/CreateEventModal';
import { Group } from '#modules/group/types/group.types';
import { EventInfiniteGrid } from '#pages/Event/EventGrid/EventInfiniteGrid';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';

import { CreateButton } from '../components/Buttons/CreateButton';

export function GroupEvents({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FlexRow pb={2} justifyContent={'end'}>
        {group.isAdmin && <CreateButton onClick={() => setOpen(true)} />}
      </FlexRow>
      <EventInfiniteGrid
        filters={{ group: [group.slug], ordering: '-end_date' }}
      />
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
