export interface EventProps {
  color: string | null; // Color of the event card
  date: Date; // Event begin date
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
  end_date: Date | null; // end date of the event
  ticketing: string | null; // url of inscription form
  effectiveSize?: number;
  globalSize?: number;
}
