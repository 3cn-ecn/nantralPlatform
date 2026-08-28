import {
  SportEventType,
  SportEvent,
  SportEventForm,
} from '#modules/event/sportevent.type';
import { Group } from '#modules/group/types/group.types';
import { useObjectState } from '#shared/hooks/useObjectState';
import { defaultTranslatedFieldValue } from '#shared/infra/translatedFields/defaultTranslatedFieldValue';

const defaultSportEventFormValues: SportEventForm = {
  descriptionTranslated: defaultTranslatedFieldValue,
  group: 0,
  location: '',
  date: new Date(),
  type: SportEventType.TRAINING,
};

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
    : defaultSportEventFormValues;
  if (group) {
    defaultValues.group = group.id;
  }
  return useObjectState(defaultValues);
}
