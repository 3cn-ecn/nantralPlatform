import { GroupPreviewDTO } from '#modules/group/infra/group.dto';

export type EventDTO = {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  publicity: 'Mem' | 'Pub';
  image: string;
  number_of_participants: number | null;
  absolute_url: string;
  group: GroupPreviewDTO;
  is_participating: boolean;
  is_member: boolean;
  max_participant: number | null;
  start_registration: string | null;
  end_registration: string | null;
  form_url: string | null;
  is_favorite: boolean;
  is_admin: boolean;
};

export type EventPreviewDTO = Pick<
  EventDTO,
  | 'id'
  | 'title'
  | 'start_date'
  | 'end_date'
  | 'group'
  | 'image'
  | 'is_admin'
  | 'is_participating'
  | 'is_favorite'
>;
