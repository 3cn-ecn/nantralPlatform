import { GroupPreview } from '#modules/group/group.type';

type LocalizedTitles = {
  [K in Language as `title_${string & K}`]: string;
};

type LocalizedDescription = {
  [K in Language as `description_${string & K}`]: string;
};

export interface Post {
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
  notificationId: number | null;
} & LocalizedTitles &
  LocalizedDescription;

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
  [K in Language as `title_${string & K}`]: string;
} & {
  [K in Language as `description_${string & K}`]: string;
} & {
  group: number | null;
  image?: File;
};
