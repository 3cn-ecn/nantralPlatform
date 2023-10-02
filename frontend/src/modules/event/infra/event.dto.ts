import { GroupPreviewDTO } from '#modules/group/infra/group.dto';
import {
  BaseLanguage,
  LocalizedDescription,
  LocalizedTitles,
} from '#shared/i18n/config';

export type EventDTO = {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  publicity: 'Mem' | 'Pub';
  image: string;
  number_of_participants: number;
  url: string;
  group: GroupPreviewDTO;
  is_group_member: boolean;
  is_group_admin: boolean;
  is_participating: boolean;
  is_bookmarked: boolean;
  max_participant: number | null;
  start_registration: string | null;
  end_registration: string | null;
  form_url: string;
  notification: number | null;
} & LocalizedTitles &
  LocalizedDescription;

export type EventPreviewDTO = Pick<
  EventDTO,
  | 'id'
  | 'title'
  | 'start_date'
  | 'end_date'
  | 'group'
  | 'image'
  | 'is_group_admin'
  | 'is_participating'
  | 'is_bookmarked'
  | 'number_of_participants'
  | 'max_participant'
  | 'form_url'
  | 'start_registration'
  | 'end_registration'
  | 'url'
> & {
  [K in BaseLanguage as `title_${string & K}`];
};

export type EventFormDTO = Pick<
  EventDTO,
  | 'title'
  | 'description'
  | 'location'
  | 'start_date'
  | 'end_date'
  | 'publicity'
  | 'max_participant'
  | 'start_registration'
  | 'end_registration'
  | 'form_url'
> & {
  [K in BaseLanguage as `title_${string & K}`];
} & {
  [K in BaseLanguage as `description_${string & K}`];
} & {
  group: number | null;
  image?: File;
};
