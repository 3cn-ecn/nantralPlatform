import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';

export interface UserDTO {
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

export type UserPreviewDTO = Pick<UserDTO, 'id' | 'name' | 'url' | 'picture'>;
