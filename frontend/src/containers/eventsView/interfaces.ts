export interface Student {
  name: string;
  get_absolute_url: string;
}

export interface Urls {
  add: string;
  remove: string;
  participants: string;
}

export interface EventInfos {
  title: string;
  group: string;
  description: string;
  location: string;
  date: Date;
  publicity: string;
  color: string;
  image: string;
  slug: string;
  number_of_participants: number;
  get_absolute_url: string;
  get_group_name: string;
  is_participating: boolean;
  is_member: boolean;
}

export interface APIUrls {
  eventsApiUrl: string;
  eventsRemoveParticipant: string;
  eventsAddParticipant: string;
  eventListParticipants: string;
}
