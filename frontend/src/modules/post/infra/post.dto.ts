import { GroupPreviewDTO } from '#modules/group/infra/group.dto';
import {
  BaseLanguage,
  LocalizedDescription,
  LocalizedTitles,
} from '#shared/i18n/config';

export type PostDTO = {
  id: number;
  title: string;
  description: string;
  group: GroupPreviewDTO;
  publicity: 'Pub' | 'Mem';
  image: string;
  created_at: string;
  updated_at: string;
  pinned: boolean;
  can_pin: boolean;
  is_admin: boolean;
  notification: number | null;
} & LocalizedTitles &
  LocalizedDescription;

export type PostPreviewDTO = Pick<
  PostDTO,
  | 'id'
  | 'title'
  | 'group'
  | 'created_at'
  | 'updated_at'
  | 'image'
  | 'pinned'
  | 'is_admin'
  | 'can_pin'
  | 'publicity'
>;

export type PostFormDTO = Pick<
  PostDTO,
  'title' | 'description' | 'publicity' | 'pinned'
> & {
  [K in BaseLanguage as `title_${string & K}`];
} & {
  [K in BaseLanguage as `description_${string & K}`];
} & {
  group: number | null;
  image?: File;
};
