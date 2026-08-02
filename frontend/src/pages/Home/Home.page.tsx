import { EventPreview } from '#modules/event/event.type';
import { GroupPreview } from '#modules/group/types/group.types';
import { FeedEventCard } from '#shared/components/FeedCard/FeedEventCard';
import { FeedPostCard } from '#shared/components/FeedCard/FeedPostCard';
import { GroupImage } from '#shared/components/GroupImage/GroupImage';

import { useGroupList } from './hooks/useGroupList';
import { useLastPosts } from './hooks/useLastPosts';
import { useUpcomingEvents } from './hooks/useUpcomingEvents';

export default function HomePage() {
  const groups = useGroupList();
  const { data: lastPosts } = useLastPosts(100);
  const { data: upcomingEvents } = useUpcomingEvents(100);
  const myGroupsIconSize = 72; // Adjust the size as needed

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="m-4">
        <h2 className="text-xl font-bold text-gray-800">Mes groupes</h2>
        <div className="bg-gray-100 flex flex-row">
          {groups?.map((group: GroupPreview) => (
            <div key={group.id} className="items-center mt-4 ml-2">
              <GroupImage group={group} size={myGroupsIconSize} />
              <p
                style={{ maxWidth: `${myGroupsIconSize * 1.2}px` }}
                className={
                  'text-center text-small text-secondary mt-2 line-clamp-1 break-all'
                }
              >
                {group.shortName || group.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2">
        {lastPosts?.results.map((post) => (
          <FeedPostCard key={post.id} content={post} />
        ))}
        {upcomingEvents?.results.map((event: EventPreview) => (
          <FeedEventCard key={event.id} content={event} />
        ))}
      </div>
    </div>
  );
}
