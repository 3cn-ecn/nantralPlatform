import { EventInfiniteGrid } from '#pages/Event/EventGrid/EventInfiniteGrid';

export function GroupEvents({ groupSlug }: { groupSlug: string }) {
  return <EventInfiniteGrid filters={{ group: [groupSlug] }} />;
}
