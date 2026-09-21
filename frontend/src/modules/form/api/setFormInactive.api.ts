import axios from 'axios';
import { UUID } from 'crypto';

import { adaptApiErrors } from '#shared/infra/errors';

export async function setFormInactiveApi(formId: UUID) {
  const { status } = await axios
    .delete(`/api/form/schema/${formId}/active/`)
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return status;
}
