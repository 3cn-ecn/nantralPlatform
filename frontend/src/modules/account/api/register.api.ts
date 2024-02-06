import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { RegisterForm } from '../account.type';
import { adaptRegisterForm } from '../infra/account.adapter';
import { RegisterDTO } from '../infra/account.dto';

interface RegisterOptions {
  form: RegisterForm;
}

export async function registerApi(params: RegisterOptions) {
  const { status } = await axios
    .post<RegisterDTO>(
      '/api/account/register/',
      adaptRegisterForm(params?.form),
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
