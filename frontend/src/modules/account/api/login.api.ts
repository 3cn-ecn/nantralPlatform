import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export interface LoginApiBody {
  email?: string;
  password?: string;
}

export async function loginApi(body: LoginApiBody) {
  const { status } = await axios
    .post('/api/account/login/', {
      email: body?.email,
      password: body?.password,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
