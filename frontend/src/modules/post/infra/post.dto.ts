import { GroupPreviewDTO } from '#modules/group/infra/group.dto';

export interface PostDTO {
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
}

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
  group: number | null;
  image?: File;
};
