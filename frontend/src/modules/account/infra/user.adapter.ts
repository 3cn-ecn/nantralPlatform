import { adaptSocialLink } from '#modules/social_link/infra/socialLink.adapter';

import { User, UserPreview } from '../user.types';
import { UserDTO, UserPreviewDTO } from './user.dto';

export function adaptUser(userDTO: UserDTO): User {
  return {
    id: userDTO.id,
    name: userDTO.name,
    url: userDTO.url,
    picture: userDTO.picture,
    promo: userDTO.promo,
    faculty: userDTO.faculty,
    path: userDTO.path,
    staff: userDTO.is_staff,
    admin: userDTO.is_superuser,
    description: userDTO.description,
    username: userDTO.username,
    socialLinks: userDTO.social_links.map((link) => adaptSocialLink(link)),
    emails: userDTO.emails.map((email) => email.email),
  };
}

export function adaptUserPreview(userDTO: UserPreviewDTO): UserPreview {
  return {
    id: userDTO.id,
    name: userDTO.name,
    url: userDTO.url,
    picture: userDTO.picture,
  };
}
