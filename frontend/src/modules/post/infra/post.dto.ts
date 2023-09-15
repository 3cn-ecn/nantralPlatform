import { GroupPreviewDTO } from '#modules/group/infra/group.dto';

type LocalizedTitles = {
  [K in Language as `title_${string & K}`]: string;
};

type LocalizedDescription = {
  [K in Language as `description_${string & K}`]: string;
};
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
> & {
  [K in Language as `title_${string & K}`]: string;
};

export type PostFormDTO = Pick<
  PostDTO,
  'title' | 'description' | 'publicity' | 'pinned'
> & {
  [K in Language as `title_${string & K}`]: string;
} & {
  [K in Language as `description_${string & K}`]: string;
} & {
  group: number | null;
  image?: File;
};
