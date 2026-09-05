import axios from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

export async function deleteFormApi(formId) {
  const { status } = await axios
    .delete(`/api/form/schema/${formId}/`)
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return status;
}
