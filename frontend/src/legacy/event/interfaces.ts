export interface Event {
  group: {
    name: string;
    slug: string;
    url: string;
    icon: string;
  };
  begin_inscription: string;
  color: string;
  date: string;
  description: string;
  end_date: string;
  end_inscription: string;
  get_absolute_url: string;
  group_slug: string;
  id: number;
  image: string;
  location: string;
  max_participant: number;
  // notification 	Notification;
  number_of_participants: number;
  // participants.all 	List
  // participants.count 	Integer
  publication_date: string;
  publicity: string;
  slug: string;
  // student_set.all 	List
  // student_set.count number;
  ticketing: string;
  title: string;
}

export interface Group {
  id: number;
  name: string;
  short_name: string;
  group_type: {
    name: string;
    slug: string;
    no_membership_dates: boolean;
  };
  parent: {
    name: string;
    slug: string;
    url: string;
    icon: string;
  };
  creation_year: number;
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
  lock_memberships: boolean;
}
