import { adaptGroupPreview } from '#modules/group/infra/group.adapter';
import { adaptTranslatedField } from '#shared/infra/translatedFields/translatedField.adapter';

import { Event, EventPreview } from '../event.type';
import { EventDTO, EventPreviewDTO } from './event.dto';

export function adaptEvent(eventDto: EventDTO): Event {
  return {
    id: eventDto.id,
    title: eventDto.title,
    titleTranslated: adaptTranslatedField(eventDto, 'title'),
    description: eventDto.description,
    descriptionTranslated: adaptTranslatedField(eventDto, 'description'),
    location: eventDto.location,
    startDate: new Date(eventDto.start_date),
    endDate: new Date(eventDto.end_date),
    publicity: eventDto.publicity,
    image: eventDto.image,
    numberOfParticipants: eventDto.number_of_participants,
    url: eventDto.url,
    group: {
      ...adaptGroupPreview(eventDto.group),
      isAdmin: eventDto.is_group_admin,
      isMember: eventDto.is_group_member,
    },
    isParticipating: eventDto.is_participating,
    isBookmarked: eventDto.is_bookmarked,
    maxParticipant: eventDto.max_participant,
    startRegistration: eventDto.start_registration
      ? new Date(eventDto.start_registration)
      : null,
    endRegistration: eventDto.end_registration
      ? new Date(eventDto.end_registration)
      : null,
    formUrl: eventDto.form_url,
    notificationId: eventDto.notification,
  };
}

export function adaptEventPreview(eventDto: EventPreviewDTO): EventPreview {
  return {
    id: eventDto.id,
    title: eventDto.title,
    startDate: new Date(eventDto.start_date),
    endDate: new Date(eventDto.end_date),
    image: eventDto.image,
    group: {
      ...adaptGroupPreview(eventDto.group),
      isAdmin: eventDto.is_group_admin,
    },
    isParticipating: eventDto.is_participating,
    isBookmarked: eventDto.is_bookmarked,
    url: eventDto.url,
    numberOfParticipants: eventDto.number_of_participants,
    maxParticipant: eventDto.max_participant,
    startRegistration: eventDto.start_registration
      ? new Date(eventDto.start_registration)
      : null,
    endRegistration: eventDto.end_registration
      ? new Date(eventDto.end_registration)
      : null,
    formUrl: eventDto.form_url,
  };
}
