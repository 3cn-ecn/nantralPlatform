export interface EventProps {
  color: string | null; // Color of the event card
  date: string; // Event begin date
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
  end_inscription: Date | null; // date of the end of inscription
  begin_inscripion: Date | null; // date of the beginning of inscription
  end_date: string | null; // end date of the event
  ticketing: string | null; // url of inscription form
  is_favorite: boolean;
  effectiveSize?: number; // The number of horizontal parts the events will used
  globalSize?: number; // The number of parts available
  position?: number; // The position in number of parts in the calendar
  placed?: boolean; // whether the event has been placed in the calendar
}
