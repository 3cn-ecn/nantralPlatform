import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

interface LoginOptions {
  email?: string;
  password?: string;
}

export async function loginApi(params?: LoginOptions) {
  const { status } = await axios
    .post('/api/account/login/', {
      email: params?.email,
      password: params?.password,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
