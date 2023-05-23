import { adaptPartialGroup } from '#modules/group/infra/group.adapter';

import { Event, PartialEvent } from '../event.type';
import { EventDTO, PartialEventDTO } from './event.dto';

export function adaptEvent(eventDto: EventDTO): Event {
  return {
    id: eventDto.id,
    title: eventDto.title,
    description: eventDto.description,
    location: eventDto.location,
    startDate: new Date(eventDto.start_date),
    endDate: new Date(eventDto.end_date),
    publicity: eventDto.publicity,
    image: eventDto.image,
    numberOfParticipants: eventDto.number_of_participants,
    url: eventDto.absolute_url,
    group: adaptPartialGroup(eventDto.group),
    isParticipating: eventDto.is_participating,
    maxParticipant: eventDto.max_participant,
    startRegistration:
      eventDto.start_registration && new Date(eventDto.start_registration),
    endRegistration:
      eventDto.end_registration && new Date(eventDto.end_registration),
    formUrl: eventDto.form_url,
    isFavorite: eventDto.is_favorite,
    isAdmin: eventDto.is_admin,
  };
}

export function adaptPartialEvent(eventDto: PartialEventDTO): PartialEvent {
  return {
    id: eventDto.id,
    title: eventDto.title,
    startDate: new Date(eventDto.start_date),
    endDate: new Date(eventDto.end_date),
    image: eventDto.image,
    group: adaptPartialGroup(eventDto.group),
    isParticipating: eventDto.is_participating,
    isFavorite: eventDto.is_favorite,
    isAdmin: eventDto.is_admin,
  };
}
