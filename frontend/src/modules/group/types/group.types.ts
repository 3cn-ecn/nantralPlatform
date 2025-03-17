import { SocialLink } from '#modules/social_link/types/socialLink.type';

import { GroupTypePreview } from './groupType.types';

export interface Group {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  url: string;
  icon?: string;
  groupType: GroupTypePreview;
  parent?: GroupPreview;
  creationYear?: number;
  archived: boolean;
  private: boolean;
  public: boolean;
  summary: string;
  description: string;
  meetingPlace: string;
  meetingHour: string;
  banner: string;
  video1: string;
  video2: string;
  isAdmin: boolean;
  isMember: boolean;
  lockMemberships: boolean;
  category: string;
  socialLinks: SocialLink[];
  subCategory?: string;
}

export type GroupPreview = Pick<
  Group,
  | 'id'
  | 'name'
  | 'shortName'
  | 'slug'
  | 'url'
  | 'icon'
  | 'category'
  | 'subCategory'
>;

export type CreateGroupForm = Pick<
  Group,
  | 'name'
  | 'shortName'
  | 'meetingHour'
  | 'video1'
  | 'video2'
  | 'private'
  | 'public'
  | 'creationYear'
  | 'slug'
  | 'archived'
  | 'summary'
  | 'description'
  | 'meetingPlace'
  | 'lockMemberships'
> & {
  childrenLabel?: string;
  icon?: File;
  banner?: File;
  label: number;
  tags: number[];
  parent?: number;
};
