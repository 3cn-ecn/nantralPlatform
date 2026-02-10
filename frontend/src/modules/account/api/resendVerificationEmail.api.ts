import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function resendVerificationEmailApi(email: string) {
  const { status } = await axios
    .post('/api/account/email/resend/', {
      email: email,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
