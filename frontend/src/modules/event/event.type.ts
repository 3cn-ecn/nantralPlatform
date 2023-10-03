import { GroupPreview } from '#modules/group/group.type';

export interface Event {
  id: number;
  title: string;
  description: string;
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
> & {
  group: GroupPreview & { isAdmin: boolean };
};

export type EventForm = Pick<
  Event,
  | 'title'
  | 'description'
  | 'location'
  | 'publicity'
  | 'maxParticipant'
  | 'startRegistration'
  | 'endRegistration'
  | 'formUrl'
> & {
  startDate: Date | null;
  endDate: Date | null;
  group: number | null;
  image?: File;
};
