import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function passwordResetRequestApi(email: string) {
  const { status } = await axios
    .post('/api/account/password_reset/', { email: email })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}

export async function passwordResetValidateTokenApi(token: string) {
  const { status } = await axios
    .post('/api/account/password_reset/validate_token/', { token: token })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}

export interface PasswordResetApiBody {
  password: string;
  token: string;
}

export async function passwordResetApi({
  password,
  token,
}: PasswordResetApiBody) {
  const { status } = await axios
    .post('/api/account/password_reset/confirm/', {
      password: password,
      token: token,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
