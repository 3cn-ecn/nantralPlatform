import { ShortMembershipForm } from '#modules/group/types/membership.types';
import { SocialLink } from '#modules/social_link/types/socialLink.type';
import { StudentPreview } from '#modules/student/student.types';

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
  isSubscribed: boolean;
  isMember: boolean;
  lockMemberships: boolean;
  category: string;
  socialLinks: SocialLink[];
  subCategory?: string;
  address: string;
  latitude: number;
  longitude: number;
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

export type MapGroupPreview = GroupPreview &
  Pick<Group, 'address' | 'latitude' | 'longitude' | 'summary' | 'banner'> & {
    members: StudentPreview[];
  };

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
  | 'address'
  | 'latitude'
  | 'longitude'
> & {
  childrenLabel?: string;
  icon?: File;
  banner?: File;
  label: number;
  tags: number[];
  parent?: number;
  changeReason?: string;
  membership?: ShortMembershipForm;
};

export type MapGroupPoint = Pick<
  Group,
  'id' | 'icon' | 'latitude' | 'longitude' | 'slug' | 'name'
>;

export type MapGroupSearch = Pick<Group, 'id' | 'icon' | 'name'>;
