import { convertTranslatedField } from '#shared/infra/translatedFields/translatedField.converter';

import { SportEventForm } from '../sportevent.type';
import { SportEventFormDTO } from './sportevent.dto';

export function convertSportEventForm(form: SportEventForm): SportEventFormDTO {
  return {
    ...convertTranslatedField(form.descriptionTranslated, 'description'),
    group: form.group,
    location: form.location,
    date: form.date.toISOString(),
    type: form.type,
  };
}
