import { Event, EventForm } from '#modules/event/event.type';
import { Group } from '#modules/group/types/group.types';
import { useObjectState } from '#shared/hooks/useObjectState';
import { defaultTranslatedFieldValue } from '#shared/infra/translatedFields/defaultTranslatedFieldValue';

const defaultEventFormValues: EventForm = {
  titleTranslated: defaultTranslatedFieldValue,
  descriptionTranslated: defaultTranslatedFieldValue,
  group: null,
  publicity: 'Pub',
  location: '',
  image: undefined,
  startDate: null,
  endDate: null,
  startRegistration: null,
  endRegistration: null,
  maxParticipant: null,
  formUrl: '',
  useNantralpay: false,
};

function convertToForm(event: Event): EventForm {
  return {
    titleTranslated: event.titleTranslated,
    descriptionTranslated: event.descriptionTranslated,
    group: event.group.id,
    publicity: event.publicity,
    location: event.location,
    image: undefined,
    startDate: event.startDate,
    endDate: event.endDate,
    startRegistration: event.startRegistration,
    endRegistration: event.endRegistration,
    maxParticipant: event.maxParticipant,
    formUrl: event.formUrl,
    useNantralpay: event.useNantralpay,
  };
}

export function useEventFormValues({
  event,
  group,
}: {
  event?: Event;
  group?: Group;
} = {}) {
  const defaultValues = event ? convertToForm(event) : defaultEventFormValues;
  if (group) {
    defaultValues.group = group.id;
  }
  return useObjectState(defaultValues);
}
