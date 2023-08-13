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
  };
}

export function adaptStudentPreview(
  studentDTO: StudentPreviewDTO
): StudentPreview {
  return {
    id: studentDTO.id,
    name: studentDTO.name,
    url: studentDTO.url,
    picture: studentDTO.picture,
  };
}
