import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function logoutApi() {
  const { status } = await axios
    .post('/api/account/logout/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
