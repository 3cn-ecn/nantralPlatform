import { SocialLink } from '#modules/social_link/types/socialLink.type';

export interface Student {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  staff: boolean;
  admin: boolean;
  description: string;
  username: string;
  socialLinks: SocialLink[];
  emails: string[];
}

export type StudentPreview = Pick<Student, 'id' | 'name' | 'url' | 'picture'>;

export type FacultyOptions = 'Gen' | 'Iti' | 'Mas' | 'Doc' | 'Bac' | 'Msp';
export type PathOptions =
  | 'Cla'
  | 'Alt'
  | 'I-A'
  | 'A-I'
  | 'I-M'
  | 'M-I'
  | 'I-O'
  | 'O-I';

export enum Faculties {
  Gen = 'login.formationFollowed.generalEngineer',
  Iti = 'login.formationFollowed.specialtyEngineer',
  Mas = 'login.formationFollowed.master',
  Doc = 'login.formationFollowed.PhD',
  Bac = 'login.formationFollowed.bachelor',
  MSp = 'login.formationFollowed.specializedMaster',
}

export enum Curriculum {
  Cla = '',
  Alt = 'login.specialProgram.apprenticeship',
  'I-A' = 'login.specialProgram.architectEngineer',
  'A-I' = 'login.specialProgram.engineerArchitect',
  'I-M' = 'login.specialProgram.engineerManager',
  'M-I' = 'login.specialProgram.managerEngineer',
  'I-O' = 'Ingénieur-Officier',
  'O-I' = 'Officier-Ingénieur',
}
