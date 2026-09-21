import axios from 'axios';
import { UUID } from 'crypto';

import { adaptApiErrors } from '#shared/infra/errors';

export async function setFormActiveApi(formId: UUID) {
  const { status } = await axios
    .post(`/api/form/schema/${formId}/active/`)
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return status;
}
