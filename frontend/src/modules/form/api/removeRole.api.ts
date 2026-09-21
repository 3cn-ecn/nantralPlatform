import axios from 'axios';
import { UUID } from 'crypto';

import { adaptApiErrors } from '#shared/infra/errors';

export async function removeRoleApi(roleId: number, formId: UUID) {
  const { status } = await axios
    .delete(`/api/form/schema/${formId}/roles/${roleId}/`)
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return { status };
}
