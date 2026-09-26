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
  /** id of the previous occurrence, if the event is recurrent */
  parent: number | null;
  /** id of the next occurrence, if the event is recurrent */
  child: number | null;
  /**
   * date of the last occurrence (null if there is no next occurrence),
   * only available when fetching the details of an event
   */
  repeatUntil?: Date | null;
}

export type SportEventForm = Pick<
  SportEvent,
  'descriptionTranslated' | 'location' | 'date' | 'type'
> & {
  group: number | null;
  isWeekly: boolean;
  repeatUntil: Date | null;
};
