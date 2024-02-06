import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function isAuthenticatedApi() {
  return await axios
    .get('/api/account/is_authenticated/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
}
