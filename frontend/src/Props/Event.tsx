export interface EventBDDProps {
  color: string | null; // Color of the event card
  date: string; // Event begin date
  end_date: string | null; // end date of the event
  description: string; // Description of the event in html
  get_absolute_url: string; // url of the event from root url
  get_group_name: string; // name of the organiser
  group: string; // slug of the organiser
  image: string | null; // uri of the banner
  is_member: boolean;
  is_participating: boolean; // whether connected user particpate at this event
  location: string; // where the event is taking place
  number_of_participants: number;
  publicity: 'Pub';
  slug: string; // slug of the event
  title: string;
  max_participant: number | null; // number max of participant
  end_inscription: string | null; // date of the end of inscription
  begin_inscription: string | null; // date of the beginning of inscription
  ticketing: string | null; // url of inscription form
  is_favorite: boolean;
  effectiveSize?: number; // The number of horizontal parts the events will used
  globalSize?: number; // The number of parts available
  position?: number; // The position in number of parts in the calendar
  placed?: boolean; // whether the event has been placed in the calendar
}

export interface EventProps {
  color: string | null; // Color of the event card
  beginDate: Date; // Event begin date in Date format
  endDate: Date; // Event begin date in Date format
  description: string; // Description of the event in html
  getAbsolute_url: string; // url of the event from root url
  getGroup_name: string; // name of the organiser
  group: string; // slug of the organiser
  image: string | null; // uri of the banner
  isMember: boolean;
  isParticipating: boolean; // whether connected user particpate at this event
  location: string; // where the event is taking place
  numberOfParticipants: number;
  publicity: 'Pub';
  slug: string; // slug of the event
  title: string;
  maxParticipant: number | null; // number max of participant
  endInscription: string | null; // date of the end of inscription
  beginInscription: string | null; // date of the beginning of inscription
  ticketing: string | null; // url of inscription form
  isFavorite: boolean;
  effectiveSize?: number; // The number of horizontal parts the events will used
  globalSize?: number; // The number of parts available
  position?: number; // The position in number of parts in the calendar
  placed?: boolean; // whether the event has been placed in the calendar
}
