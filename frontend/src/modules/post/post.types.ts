import { GroupPreview } from '#modules/group/group.type';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

export interface Post {
  id: number;
  title: string;
  titleTranslated: TranslatedFieldObject;
  description: string;
  descriptionTranslated: TranslatedFieldObject;
  group: GroupPreview & { canPin: boolean };
  publicity: 'Pub' | 'Mem';
  createdAt: Date;
  updatedAt: Date;
  image: string;
  pinned: boolean;
  isAdmin: boolean;
  notificationId: number | null;
}

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
  | 'title'
  | 'titleTranslated'
  | 'description'
  | 'descriptionTranslated'
  | 'publicity'
  | 'pinned'
> & {
  group: number | null;
  image?: File;
};
