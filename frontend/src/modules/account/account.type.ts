import { FacultyOptions, PathOptions } from './infra/account.dto';

export interface RegisterForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  promo: number;
  faculty: FacultyOptions;
  path: PathOptions;
  invitationUUID?: string;
  passwordConfirm?: string;
}

export interface RegisterCreated {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  promo: number;
  faculty: FacultyOptions;
  path: PathOptions;
}
