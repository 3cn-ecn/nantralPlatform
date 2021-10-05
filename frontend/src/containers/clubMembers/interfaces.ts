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
  function?: string;
  date_begin?: string;
  date_end?: string;
  year?: string;
  order?: number;
  group: number;
}
