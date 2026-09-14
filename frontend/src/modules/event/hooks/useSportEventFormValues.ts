import {
  SportEventType,
  SportEvent,
  SportEventForm,
} from '#modules/event/sportevent.type';
import { Group } from '#modules/group/types/group.types';
import { useObjectState } from '#shared/hooks/useObjectState';
import { defaultTranslatedFieldValue } from '#shared/infra/translatedFields/defaultTranslatedFieldValue';

function getDefaultSportEventFormValues(): SportEventForm {
  return {
    descriptionTranslated: defaultTranslatedFieldValue,
    group: null,
    location: '',
    // default to 1h from now: filling the form takes time, and the date
    // must not be in the past by the time it is submitted
    date: new Date(Date.now() + 60 * 60 * 1000),
    type: SportEventType.TRAINING,
  };
}

function convertToForm(event: SportEvent): SportEventForm {
  return {
    descriptionTranslated: event.descriptionTranslated,
    group: event.group.id,
    location: event.location,
    date: event.date,
    type: event.type,
  };
}

export function useSportEventFormValues({
  event,
  group,
}: {
  event?: SportEvent;
  group?: Group;
} = {}) {
  const defaultValues = event
    ? convertToForm(event)
    : getDefaultSportEventFormValues();
  if (group) {
    defaultValues.group = group.id;
  }
  return useObjectState(defaultValues);
}
