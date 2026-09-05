import axios from 'axios';
import { UUID } from 'crypto';

import { adaptUserRole } from '#modules/form/infra/jsonForm.adapter';
import { UserRole } from '#modules/form/types/jsonForm.type';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function addRolesApi(
  users: number[],
  role: UserRole['role'],
  formId: UUID,
): Promise<UserRole[]> {
  const { data } = await axios
    .post(`/api/form/schema/${formId}/roles/`, {
      users,
      role,
    })
    .catch((error) => {
      throw adaptApiFormErrors(error);
    });
  return data.map(adaptUserRole);
}
