import { FacultyOptions, PathOptions } from '#modules/account/user.types';

export interface RegisterDTO {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  promo: number;
  faculty: FacultyOptions;
  path?: PathOptions;
  invitation_uuid?: string;
}

export interface RegisterCreatedDTO {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  promo: number;
  faculty: FacultyOptions;
  path: PathOptions;
}
