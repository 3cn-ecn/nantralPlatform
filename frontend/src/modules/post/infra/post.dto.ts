import { PartialGroupDTO } from '#modules/group/infra/group.dto';

export type PostDTO = {
  id: number;
  color: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  image: string;
  group: PartialGroupDTO;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  can_pin: boolean;
  is_admin: boolean;
};
