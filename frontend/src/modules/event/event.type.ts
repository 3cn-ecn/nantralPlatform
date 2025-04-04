import { GroupPreview } from '#modules/group/types/group.types';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

export interface Event {
  id: number;
  title: string;
  titleTranslated: TranslatedFieldObject;
  description: string;
  descriptionTranslated: TranslatedFieldObject;
  location: string;
  startDate: Date;
  endDate: Date;
  publicity: 'Mem' | 'Pub';
  image: string;
  numberOfParticipants: number;
  url: string;
  group: GroupPreview & { isAdmin: boolean; isMember: boolean };
  isParticipating: boolean;
  isBookmarked: boolean;
  maxParticipant: number | null;
  startRegistration: Date | null;
  endRegistration: Date | null;
  formUrl: string;
  notificationId: number | null;
  nantralpayIsOpen: boolean;
  useNantralpay: boolean;
}

export type EventPreview = Pick<
  Event,
  | 'id'
  | 'title'
  | 'startDate'
  | 'endDate'
  | 'image'
  | 'isParticipating'
  | 'isBookmarked'
  | 'numberOfParticipants'
  | 'maxParticipant'
  | 'formUrl'
  | 'startRegistration'
  | 'endRegistration'
  | 'url'
  | 'nantralpayIsOpen'
> & {
  group: GroupPreview & { isAdmin: boolean };
};

export type EventForm = Pick<
  Event,
  | 'titleTranslated'
  | 'descriptionTranslated'
  | 'location'
  | 'publicity'
  | 'maxParticipant'
  | 'startRegistration'
  | 'endRegistration'
  | 'formUrl'
  | 'useNantralpay'
> & {
  startDate: Date | null;
  endDate: Date | null;
  group: number | null;
  image?: File;
};
