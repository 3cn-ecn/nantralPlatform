import axios from 'axios';

import { adaptEmail } from '#modules/account/infra/email.adapter';
import { adaptApiFormErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function addEmailApi(email: string, user?: number) {
  const { data } = await axios
    .post('/api/account/email/', { email, user })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiFormErrors(err);
    });
  return adaptEmail(data);
}
