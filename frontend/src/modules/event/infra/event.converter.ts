import { convertTranslatedField } from '#shared/infra/translatedFields/translatedField.converter';

import { EventForm } from '../event.type';
import { EventFormDTO } from './event.dto';

export function convertEventForm(event: EventForm): EventFormDTO {
  return {
    ...convertTranslatedField(event.titleTranslated, 'title'),
    ...convertTranslatedField(event.descriptionTranslated, 'description'),
    group: event.group,
    location: event.location,
    image: event.image,
    start_date: event.startDate?.toISOString() || '',
    end_date: event.endDate?.toISOString() || '',
    publicity: event.publicity,
    max_participant: event.maxParticipant,
    start_registration: event.startRegistration?.toISOString() || null,
    end_registration: event.endRegistration?.toISOString() || null,
    form_url: event.formUrl,
  };
}
