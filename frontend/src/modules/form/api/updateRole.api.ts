import axios from 'axios';
import { UUID } from 'crypto';

import { adaptUserRole } from '#modules/form/infra/jsonForm.adapter';
import { UserRole } from '#modules/form/types/jsonForm.type';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function updateRoleApi(
  id: number,
  role: UserRole['role'],
  formId: UUID,
) {
  const { data } = await axios
    .put(`/api/form/schema/${formId}/roles/${id}/`, { role })
    .catch((error) => {
      throw adaptApiFormErrors(error);
    });
  return adaptUserRole(data);
}
