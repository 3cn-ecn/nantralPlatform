import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export interface LoginApiBody {
  email?: string;
  password?: string;
  email_ecn?: string;
}

export async function loginApi(body: LoginApiBody) {
  const { status } = await axios
    .post('/api/account/login/', {
      email: body?.email,
      password: body?.password,
      email_ecn: body?.email_ecn,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
