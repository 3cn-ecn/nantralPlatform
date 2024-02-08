import { FacultyOptions, PathOptions } from './infra/account.dto';

export interface RegisterForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  promo: number;
  faculty: {
    label: string;
    value: FacultyOptions;
  };
  path: {
    label: string;
    value: PathOptions;
  };
  invitationUUID?: string;
  passwordConfirm?: string;
}

export interface RegisterCreated {
  firstName: string;
  lastName: string;
  email: string;
  promo: number;
  faculty: FacultyOptions;
  path: PathOptions;
}
