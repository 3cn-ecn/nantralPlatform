import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function isAuthenticatedApi(): Promise<boolean> {
  return axios
    .get('/api/account/is_authenticated/')
    .then((res) => res.status === 200)
    .catch((err: ApiErrorDTO) => {
      const status = err.response?.status;
      if (status === 403) {
        return false;
      } else {
        throw adaptApiErrors(err);
      }
    });
}
