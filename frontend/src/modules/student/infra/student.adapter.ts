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
    staff: studentDTO.staff,
    description: studentDTO.description,
    username: studentDTO.username,
    socialLinks: studentDTO.social_links.map((link) => adaptSocialLink(link)),
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
