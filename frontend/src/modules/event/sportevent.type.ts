import { GroupPreview } from '#modules/group/types/group.types';
import i18n from '#shared/i18n/config';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

export enum SportEventType {
  TRAINING = 1,
  COMPETITION = 2,
}

export function sportEventTypeToString(type: SportEventType): string {
  return i18n.t(`sport.eventType.${SportEventType[type].toLowerCase()}`);
}

export interface SportEvent {
  id: number;
  description: string;
  descriptionTranslated: TranslatedFieldObject;
  location: string;
  date: Date;
  isParticipating: boolean | null;
  participantsCount: number;
  nonParticipantsCount: number;
  group: GroupPreview;
  type: SportEventType;
}

export type SportEventForm = Pick<
  SportEvent,
  'descriptionTranslated' | 'location' | 'date' | 'type'
> & {
  group: number | null;
};
