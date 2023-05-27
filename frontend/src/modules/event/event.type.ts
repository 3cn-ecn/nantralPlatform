import { PartialGroup } from '#modules/group/group.type';

export type Event = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  group: PartialGroup;
  image: string;
  isAdmin: boolean;
  isParticipating: boolean;
  isFavorite?: boolean;
  url: string;
  description: string;
  location: string;
  publicity: 'Pub' | 'Mem';
  numberOfParticipants: number;
  maxParticipant?: number;
  startRegistration?: Date;
  endRegistration?: Date;
  formUrl?: string;
};

export type PartialEvent = Pick<
  Event,
  | 'id'
  | 'title'
  | 'startDate'
  | 'endDate'
  | 'group'
  | 'image'
  | 'isAdmin'
  | 'isParticipating'
  | 'isFavorite'
>;

export type EventCalendarItem = Event & {
  effectiveSize?: number;
  globalSize?: number;
  position?: number;
  placed?: boolean;
  slug?: string;
};
