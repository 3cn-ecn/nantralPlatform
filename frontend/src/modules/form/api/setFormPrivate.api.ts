import axios from 'axios';
import { UUID } from 'crypto';

import { adaptApiErrors } from '#shared/infra/errors';

export async function setFormPrivateApi(formId: UUID) {
  const { status } = await axios
    .delete(`/api/form/schema/${formId}/public/`)
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return status;
}
