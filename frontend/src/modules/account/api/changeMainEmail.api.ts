import axios from 'axios';

import { adaptApiFormErrors } from '#shared/infra/errors';

export async function changeMainEmailApi(
  email: string,
  password: string,
  user: number,
): Promise<string> {
  const { data } = await axios
    .put(
      '/api/account/email/change/',
      { email, password },
      { params: { user } },
    )
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return data.message;
}
