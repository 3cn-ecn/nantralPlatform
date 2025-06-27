import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

import { adaptUsername } from '../infra/account.adapter';

export default async function getUsernameApi() {
  const { data } = await axios
    .get('/api/account/username/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptUsername(data);
}
