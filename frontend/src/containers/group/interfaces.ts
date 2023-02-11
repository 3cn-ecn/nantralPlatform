export interface Group {
  name: string;
  slug: string;
  url: string;
  icon_url: string;
}

export interface Student {
  id: number;
  full_name: string;
  url: string;
  picture_url: string;
}

export interface Membership {
  id: number;
  student: Student;
  group: Group;
  summary: string;
  description: string;
  begin_date: Date;
  end_date: Date;
  order: number;
  admin: boolean;
  admin_request?: boolean;
  dragId?: string;
}
