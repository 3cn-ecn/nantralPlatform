import { GroupPreview } from '#modules/group/group.type';

export type Post = {
  id: number;
  title: string;
  description: string;
  group: GroupPreview & { canPin: boolean };
  publicity: 'Pub' | 'Mem';
  createdAt: Date;
  updatedAt: Date;
  image: string;
  pinned: boolean;
  isAdmin: boolean;
};

export type PostPreview = Pick<
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

export type PostForm = Pick<
  Post,
  'title' | 'description' | 'publicity' | 'pinned'
> & {
  group: number;
  image: File;
};
