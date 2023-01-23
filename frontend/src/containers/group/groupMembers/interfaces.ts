export interface Student {
  id: number;
  name: string;
  absolute_url: string;
  promo: number;
  picture?: string;
  faculty: string;
  path?: string;
  user: number;
}

export interface Member {
  id: number;
  student: Student;
  admin: boolean;
  summary?: string;
  begin_date?: string;
  end_date?: string;
  order?: number;
  group: number;
}

export interface MemberAdd {
  id: number;
  admin: boolean;
  summary: string;
  begin_date?: string;
  end_date?: string;
}

export interface StudentCardBodyProps {
  editMode: boolean;
  member: Member;
}
