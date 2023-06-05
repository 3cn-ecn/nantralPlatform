import { PartialGroup } from '#modules/group/group.type';

export type Post = {
  id: number;
  title: string;
  description: string;
  group: PartialGroup & { canPin: boolean };
  publicity: 'Pub' | 'Mem';
  createdAt: Date;
  updatedAt: Date;
  image: string | File;
  pinned: boolean;
  isAdmin: boolean;
};

export type PartialPost = Pick<
  Post,
  | 'id'
  | 'title'
  | 'group'
  | 'createdAt'
  | 'updatedAt'
  | 'image'
  | 'pinned'
  | 'isAdmin'
  | 'publicity'
>;
