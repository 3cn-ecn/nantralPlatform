import axios from 'axios';

import { adaptEmail } from '#modules/account/infra/email.adapter';
import { ApiErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

export async function addEmailApi(email: string) {
  const { data } = await axios
    .post('/api/account/email/', {
      email,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiFormErrors(err);
    });
  return adaptEmail(data);
}
