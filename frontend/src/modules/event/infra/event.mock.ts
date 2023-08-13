import { EventPreview } from '../event.type';

export function getMockEventPreview(
  event: Partial<EventPreview>
): EventPreview {
  const id = event.id || 0;
  return {
    startDate: event.startDate || new Date(),
    endDate: event.endDate || new Date(),
    id: id,
    title: event.title || `Event ${id}`,
    image: event.image || '',
    isParticipating: event.isParticipating || false,
    isBookmarked: event.isBookmarked || false,
    numberOfParticipants: event.numberOfParticipants || 0,
    maxParticipant: event.maxParticipant || 0,
    formUrl: event.formUrl || '',
    url: event.url || '',
    startRegistration: event.startRegistration || null,
    endRegistration: event.endRegistration || null,
    group: event.group || {
      isAdmin: false,
      id: id,
      name: `Group ${id}`,
      url: '',
      shortName: `Group ${id}`,
      slug: `group-${id}`,
    },
  };
}
