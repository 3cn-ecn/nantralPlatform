import { useState } from 'react';

import { Event } from '#modules/event/event.type';
import { BookmarkedButton } from '#modules/event/view/shared/BookmarkedButton';
import { ParticipateButton } from '#modules/event/view/shared/ParticipateButton';
import { DeleteButton } from '#pages/EventDetails/components/ActionButtons/DeleteButton';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { MoreActionsButton } from '#shared/components/MoreActionsButton/MoreActionsButton';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { AddToCalendarButton } from './ActionButtons/AddToCalendarButton';
import { EditButton } from './ActionButtons/EditButton';
import { ParticipantsButton } from './ActionButtons/ParticipantsButton';
import { ShareButton } from './ActionButtons/ShareButton';

interface ActionButtonsBarProps {
  event: Event;
}

export function ActionButtonsBar({ event }: ActionButtonsBarProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <FlexRow gap={1} flexWrap="wrap">
      <ParticipateButton event={event} />
      <BookmarkedButton eventId={event.id} selected={event.isBookmarked} />
      <Spacer flex={1} />
      <FlexRow gap={1} flexWrap="wrap">
        <ShareButton eventId={event.id} />
        {!event.formUrl && <ParticipantsButton event={event} />}
        <MoreActionsButton
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
          menuPosition="bottom-left"
        >
          {event.group.isAdmin && (
            <>
              <EditButton eventId={event.id} />
              <DeleteButton event={event} />
            </>
          )}
          <AddToCalendarButton event={event} />
        </MoreActionsButton>
      </FlexRow>
    </FlexRow>
  );
}
