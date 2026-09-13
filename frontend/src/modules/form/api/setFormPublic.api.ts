import axios from 'axios';
import { UUID } from 'crypto';

import { adaptApiErrors } from '#shared/infra/errors';

export async function setFormPublicApi(formId: UUID) {
  const { status } = await axios
    .post(`/api/form/schema/${formId}/public/`)
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return status;
}
