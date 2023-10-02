import { base_languages } from '#shared/i18n/config';

import { EventForm } from '../event.type';
import { EventFormDTO } from './event.dto';

export function convertEventForm(event: EventForm): EventFormDTO {
  const translatedConverter = {};
  let translated_title: string | null = null;
  let translated_description: string | null = null;
  for (const lang of base_languages) {
    translated_title = event[`title_${lang}`] || null;
    translated_description = event[`description_${lang}`] || null;
  }
  for (const lang of base_languages) {
    if (!event[`title_${lang}`] && translated_title) {
      event[`title_${lang}`] = translated_title;
    }
    if (!event[`description_${lang}`] && translated_description) {
      event[`description_${lang}`] = translated_description;
    }
    translatedConverter[`title_${lang}`] = event[`title_${lang}`];
    translatedConverter[`description_${lang}`] = event[`description_${lang}`];
  }
  return {
    title: event.title,
    group: event.group,
    description: event.description,
    ...translatedConverter,
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
