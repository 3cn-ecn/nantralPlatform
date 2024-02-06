export interface RegisterForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  promo: number;
  faculty: {
    label: string;
    value: 'Gen' | 'Iti' | 'Mas' | 'Doc' | 'Bac' | 'MSp';
  };
  path: {
    label: string;
    value: 'Cla' | 'Alt' | 'I-A' | 'A-I' | 'I-M' | 'M-I' | 'I-O' | 'O-I';
  };
  invitationUUID?: string;
  passwordConfirm?: string;
}
