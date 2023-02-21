export interface Group {
  id: number;
  name: string;
  short_name: string;
  group_type: {
    name: string;
    slug: string;
    place_required: boolean;
    is_year_group: boolean;
  };
  parent: {
    name: string;
    slug: string;
    url: string;
    icon: string;
  };
  year: number;
  slug: string;
  archived: boolean;
  private: boolean;
  public: boolean;
  summary: string;
  description: string;
  meeting_place: string;
  meeting_hour: string;
  icon: string;
  banner: string;
  video1: string;
  video2: string;
  url: string;
  is_admin: boolean;
  is_member: boolean;
}

export interface Student {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
}

export interface Membership {
  id: number;
  student: {
    id: number;
    full_name: string;
    url: string;
    picture: string;
  };
  group: {
    name: string;
    slug: string;
    url: string;
    icon: string;
  };
  summary: string;
  description: string;
  begin_date: string;  // date as ISO string
  end_date: string;  // date as ISO string
  priority: number;
  admin: boolean;
  admin_request?: boolean;
  dragId?: string;
}
