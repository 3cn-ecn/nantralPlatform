import { adaptStudentPreview } from '#modules/student/infra/student.adapter';

import { AdminRequest } from '../types/adminRequest.type';
import { AdminRequestDTO } from './adminRequest.dto';

export function adaptAdminRequest(adminRequest: AdminRequestDTO): AdminRequest {
  return {
    id: adminRequest.id,
    student: adaptStudentPreview(adminRequest.student),
    admin: adminRequest.admin,
    adminRequestMessage: adminRequest.admin_request_message,
  };
}
