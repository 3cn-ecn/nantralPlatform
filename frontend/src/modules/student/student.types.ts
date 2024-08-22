export interface Student {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  staff: boolean;
}

export type StudentPreview = Pick<Student, 'id' | 'name' | 'url' | 'picture'>;

export enum Faculties {
  Gen = 'login.formationFollowed.generalEngineer',
  Iti = 'login.formationFollowed.specialtyEngineer',
  Mst = 'login.formationFollowed.master',
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
