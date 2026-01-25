import { ShortMembershipFormDTO } from '#modules/group/infra/membership.dto';
import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';
import { StudentPreviewDTO } from '#modules/student/infra/student.dto';

import { GroupThematicDTO } from './groupThematic.dto';
import { GroupTypePreviewDTO } from './groupType.dto';

export interface GroupDTO {
  id: number;
  name: string;
  french_name: string;
  english_name: string;
  short_name: string;
  french_short_name: string;
  english_short_name: string;
  slug: string;
  url: string;
  icon?: string;
  group_type: GroupTypePreviewDTO;
  parent?: GroupPreviewDTO;
  thematic: GroupThematicDTO | null;
  creation_year?: number;
  archived: boolean;
  private: boolean;
  public: boolean;
  summary: string;
  french_summary: string;
  english_summary: string;
  description: string;
  french_description: string;
  english_description: string;
  meeting_place: string;
  meeting_hour: string;
  banner: string;
  video1: string;
  video2: string;
  is_admin: boolean;
  is_subscribed: boolean;
  is_member: boolean;
  lock_memberships: boolean;
  category: string;
  sub_category?: string;
  social_links: SocialLinkDTO[];
  address: string;
  latitude: number;
  longitude: number;
}

export type GroupPreviewDTO = Pick<
  GroupDTO,
  | 'id'
  | 'name'
  | 'short_name'
  | 'slug'
  | 'url'
  | 'icon'
  | 'category'
  | 'sub_category'
  | 'thematic'
>;

export type MapGroupPreviewDTO = GroupPreviewDTO &
  Pick<
    GroupDTO,
    'address' | 'latitude' | 'longitude' | 'summary' | 'banner'
  > & {
    members: StudentPreviewDTO[];
  };

export type MapGroupSearchDTO = Pick<GroupDTO, 'id' | 'name' | 'icon'>;

export type CreateGroupFormDTO = Pick<
  GroupDTO,
  | 'french_name'
  | 'english_name'
  | 'french_short_name'
  | 'english_short_name'
  | 'meeting_hour'
  | 'video1'
  | 'video2'
  | 'private'
  | 'public'
  | 'creation_year'
  | 'slug'
  | 'archived'
  | 'french_summary'
  | 'english_summary'
  | 'french_description'
  | 'english_description'
  | 'meeting_place'
  | 'lock_memberships'
  | 'address'
  | 'latitude'
  | 'longitude'
> & {
  thematic: number | null;
  children_label?: string;
  icon?: File;
  banner?: File;
  label: number | null;
  tags: number[];
  parent?: number;
  _change_reason?: string;
  membership?: ShortMembershipFormDTO;
};
