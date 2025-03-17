import { StudentPreview } from '#modules/student/student.types';

export interface AdminRequest {
  id: number;
  student: StudentPreview;
  admin: boolean;
  adminRequestMessage: string;
}
