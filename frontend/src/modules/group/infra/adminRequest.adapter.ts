import { adaptUserPreview } from '#modules/account/infra/user.adapter';

import { AdminRequest } from '../types/adminRequest.type';
import { AdminRequestDTO } from './adminRequest.dto';

export function adaptAdminRequest(adminRequest: AdminRequestDTO): AdminRequest {
  return {
    id: adminRequest.id,
    user: adaptUserPreview(adminRequest.user),
    admin: adminRequest.admin,
    adminRequestMessage: adminRequest.admin_request_message,
  };
}
