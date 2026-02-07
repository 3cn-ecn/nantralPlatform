import { adaptSocialLink } from '#modules/social_link/infra/socialLink.adapter';

import { Student, StudentPreview } from '../student.types';
import { StudentDTO, StudentPreviewDTO } from './student.dto';

export function adaptStudent(studentDTO: StudentDTO): Student {
  return {
    id: studentDTO.id,
    name: studentDTO.name,
    url: studentDTO.url,
    picture: studentDTO.picture,
    promo: studentDTO.promo,
    faculty: studentDTO.faculty,
    path: studentDTO.path,
    staff: studentDTO.is_staff,
    admin: studentDTO.is_superuser,
    description: studentDTO.description,
    username: studentDTO.username,
    socialLinks: studentDTO.social_links.map((link) => adaptSocialLink(link)),
    emails: studentDTO.emails.map((email) => email.email),
  };
}

export function adaptStudentPreview(
  studentDTO: StudentPreviewDTO,
): StudentPreview {
  return {
    id: studentDTO.id,
    name: studentDTO.name,
    url: studentDTO.url,
    picture: studentDTO.picture,
  };
}
