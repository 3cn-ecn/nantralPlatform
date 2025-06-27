import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export default async function getUsernameApi() {
  return axios
    .get('/api/account/username/')
    .then(
      (res) => res.data as { username: string; name: string; picture: string },
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
}
