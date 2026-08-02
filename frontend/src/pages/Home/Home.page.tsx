import { EventPreview } from '#modules/event/event.type';
import { EventCard } from '#modules/event/view/EventCard/EventCard';
import { GroupPreview } from '#modules/group/types/group.types';
import { FeedPostCard } from '#modules/post/view/PostCard/FeedPostCard';
import { GroupImage } from '#shared/components/GroupImage/GroupImage';

import { useGroupList } from './hooks/useGroupList';
import { useLastPosts } from './hooks/useLastPosts';
import { useUpcomingEvents } from './hooks/useUpcomingEvents';

export default function HomePage() {
  const groups = useGroupList();
  const { data: lastPosts } = useLastPosts(100); // Fetch last posts with a limit of 100
  const { data: upcomingEvents } = useUpcomingEvents(100); // Fetch upcoming events with a limit of 100
  const myGroupsIconSize = 72; // Adjust the size as needed

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* My Groups Section */}
      <div className="m-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mes groupes</h2>
        <div className="bg-gray-100 flex flex-row overflow-x-auto gap-2 ml-2">
          {groups?.map((group: GroupPreview) => (
            <div key={group.id} className="items-center">
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
      {/* Upcoming Events Section */}
      <div className="m-4">
        <h2 className="text-xl font-bold text-gray-800">Événements à venir</h2>
        <div className="flex flex-row gap-2 overflow-x-auto mt-4 ml-2">
          {upcomingEvents?.results.map((event: EventPreview) => (
            <div key={event.id} className="min-w-[300px] min-h-[350px]">
              <EventCard event={event} className="" />
            </div>
          ))}
        </div>
      </div>
      {/* Last Posts Section */}
      <div className="mt-2">
        {lastPosts?.results.map((post) => (
          <FeedPostCard key={post.id} content={post} />
        ))}
      </div>
    </div>
  );
}
