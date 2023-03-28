export interface ClubProps {
  name: string;
  icon: string;
  url: string;
  is_admin: boolean;
}

export interface SimpleGroupProps {
  name: string;
  id: number;
  short_name: string;
  slug: string;
  url: string;
  icon?: string;
  category: string;
}

export interface GroupProps extends SimpleGroupProps {
  group_type: {
    name: string;
    slug: string;
    no_membership_dates: boolean;
  };
  parent?: SimpleGroupProps;
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
}

export interface SimpleStudentProps {
  id: number;
  full_name: string;
  url: string;
  picture: string;
}

export interface StudentProps {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
}

export interface MembershipProps {
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
  begin_date?: string; // date as ISO string
  end_date?: string; // date as ISO string
  priority: number;
  admin: boolean;
  admin_request?: boolean;
  dragId: string;
}

export interface Page<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
