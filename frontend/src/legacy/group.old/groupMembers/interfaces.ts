export interface Student {
  id: number;
  name: string;
  url: string;
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
  function?: string;
  date_begin?: string;
  date_end?: string;
  order?: number;
  group: number;
  year?: number;
}

export interface MemberAdd {
  id: number;
  admin: boolean;
  function: string;
  date_begin?: string;
  date_end?: string;
}

export interface StudentCardBodyProps {
  editMode: boolean;
  member: Member;
}
