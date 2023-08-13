export type Student = {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  staff: boolean;
};

export type StudentPreview = Pick<Student, 'id' | 'name' | 'url' | 'picture'>;
