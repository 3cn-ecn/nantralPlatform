export type Group = {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  url: string;
  icon?: string;
  group_type: PartialGroup;
  parent?: PartialGroup;
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
  is_member: boolean;
  lock_memberships: boolean;
};

export type PartialGroup = Pick<
  Group,
  'id' | 'name' | 'short_name' | 'slug' | 'url' | 'icon'
>;
