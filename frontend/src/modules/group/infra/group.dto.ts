import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';

import { GroupTypePreviewDTO } from './groupType.dto';

export interface GroupDTO {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  url: string;
  icon?: string;
  group_type: GroupTypePreviewDTO;
  parent?: GroupPreviewDTO;
  creation_year?: number;
  archived: boolean;
  private: boolean;
  public: boolean;
  summary: string;
  description: string;
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
>;

export type CreateGroupFormDTO = Pick<
  GroupDTO,
  | 'name'
  | 'short_name'
  | 'meeting_hour'
  | 'video1'
  | 'video2'
  | 'private'
  | 'public'
  | 'creation_year'
  | 'slug'
  | 'archived'
  | 'summary'
  | 'description'
  | 'meeting_place'
  | 'lock_memberships'
> & {
  children_label?: string;
  icon?: File;
  banner?: File;
  label: number | null;
  tags: number[];
  parent?: number;
  _change_reason?: string;
};
