import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';

export interface StudentDTO {
  id: number;
  name: string;
  promo: number;
  picture: string;
  faculty: string;
  path: string;
  url: string;
  staff: boolean;
  description: string;
  social_links: SocialLinkDTO[];
  username: string;
}

export type StudentPreviewDTO = Pick<
  StudentDTO,
  'id' | 'name' | 'url' | 'picture'
>;
