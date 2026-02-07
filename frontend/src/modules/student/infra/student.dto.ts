import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';

export interface StudentDTO {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  is_staff: boolean;
  is_superuser: boolean;
  description: string;
  social_links: SocialLinkDTO[];
  emails: { email: string }[];
  username: string;
}

export type StudentPreviewDTO = Pick<
  StudentDTO,
  'id' | 'name' | 'url' | 'picture'
>;
