export interface RegisterDTO {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  promo: number;
  faculty: 'Gen' | 'Iti' | 'Mas' | 'Doc' | 'Bac' | 'MSp';
  path?: 'Cla' | 'Alt' | 'I-A' | 'A-I' | 'I-M' | 'M-I' | 'I-O' | 'O-I';
  invitation_uuid?: string;
}
