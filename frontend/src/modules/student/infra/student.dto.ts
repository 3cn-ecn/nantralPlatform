export interface StudentDTO {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  staff: boolean;
}

export type StudentPreviewDTO = Pick<
  StudentDTO,
  'id' | 'name' | 'url' | 'picture'
>;
