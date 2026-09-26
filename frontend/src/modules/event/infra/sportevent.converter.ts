import { endOfDay, isValid } from 'date-fns';

import { convertTranslatedField } from '#shared/infra/translatedFields/translatedField.converter';

import { SportEventForm } from '../sportevent.type';
import { SportEventFormDTO } from './sportevent.dto';

function convertRepeatUntil(form: SportEventForm): string | null | undefined {
  if (!form.isWeekly) {
    return null;
  }
  if (!form.repeatUntil || !isValid(form.repeatUntil)) {
    // do not change the repetition if the end date is missing
    return undefined;
  }
  // include the occurrence on the last day, whatever its time
  return endOfDay(form.repeatUntil).toISOString();
}

export function convertSportEventForm(form: SportEventForm): SportEventFormDTO {
  return {
    ...convertTranslatedField(form.descriptionTranslated, 'description'),
    owner: form.group,
    location: form.location,
    date: form.date.toISOString(),
    type: form.type,
    repeat_until: convertRepeatUntil(form),
  };
}
