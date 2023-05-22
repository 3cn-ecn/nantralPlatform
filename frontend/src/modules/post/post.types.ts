import { PartialGroup } from '#modules/group/group.type';

export type Post = {
  id: number;
  color: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | File;
  group: PartialGroup;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  canPin: boolean;
  isAdmin: boolean;
};
