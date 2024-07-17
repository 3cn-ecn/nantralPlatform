import { StudentPreview } from '#modules/student/student.types';

export interface AdminRequestDTO {
  id: number;
  student: StudentPreview;
  admin: boolean;
  admin_request_message: string;
}
