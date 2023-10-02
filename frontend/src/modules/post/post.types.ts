import { GroupPreview } from '#modules/group/group.type';
import {
  BaseLanguage,
  LocalizedDescription,
  LocalizedTitles,
} from '#shared/i18n/config';

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
  [K in BaseLanguage as `title_${string & K}`]: string;
} & {
  [K in BaseLanguage as `description_${string & K}`]: string;
} & {
  group: number | null;
  image?: File;
};
