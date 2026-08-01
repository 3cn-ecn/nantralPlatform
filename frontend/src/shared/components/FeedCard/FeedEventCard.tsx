import { Event } from '#modules/event/event.type';
import { BookmarkedButton } from '#modules/event/view/shared/BookmarkedButton';
import { MoreEventActionsButton } from '#modules/event/view/shared/MoreEventActionsButton';
import { ParticipateButton } from '#modules/event/view/shared/ParticipateButton';

import { Card } from '../Card';
import { GroupImage } from '../GroupImage/GroupImage';

interface FeedCardProps {
  content: Event;
}

export function FeedEventCard({ content }: Readonly<FeedCardProps>) {
  const authorName = content.group.name;
  const fromDate = content.startDate;
  const toDate = content.endDate;

  return (
    <Card className="max-w-3xl mx-auto p-3">
      {/* Card header with author information */}
      <div className="px-4 pt-4 flex flex-row items-center gap-4">
        <GroupImage group={content.group} size={48} />
        <div className="flex flex-col">
          <p className="text-md font-medium text-gray-800">{authorName}</p>
          <p className="text-xs font-normal text-gray-400">
            {fromDate &&
            toDate &&
            fromDate.toLocaleDateString() !== toDate.toLocaleDateString() // If it's the same day, we don't need to show the date twice
              ? `Du ${fromDate?.toLocaleDateString()} à ${fromDate?.toLocaleTimeString()} au ${toDate?.toLocaleDateTimeString()} à ${toDate?.toLocaleTimeString()}`
              : `Le ${fromDate?.toLocaleDateString()} de ${fromDate?.toLocaleTimeString()} à ${toDate?.toLocaleTimeString()}`}
          </p>
        </div>
      </div>
      {/* Card content */}
      <div className="mt-2 px-4 pb-4">
        <h3 className="text-lg font-medium text-gray-800">{content.title}</h3>
        <p className="text-sm font-normal text-gray-500">
          {content.description}
        </p>
        <div className="mt-8">
          <img src={content.image} alt={content.title} className="rounded-lg" />
        </div>
      </div>
      {/* Card footer with like and participate buttons */}
      <div>
        <ParticipateButton event={content} sx={{ width: '100%', mr: 1 }} />
        <BookmarkedButton
          eventId={content.id}
          selected={content.isBookmarked}
        />
        <MoreEventActionsButton
          isAdmin={content.group.isAdmin}
          sharedUrl={`${window.location.origin}/event/${content.id}`}
          eventId={content.id}
          isParticipating={content.isParticipating}
        />
      </div>
    </Card>
  );
}
