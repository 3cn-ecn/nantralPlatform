import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { RegisterForm } from '../account.type';
import { adaptRegisterForm } from '../infra/account.adapter';
import { RegisterDTO } from '../infra/account.dto';

export async function registerApi(form: RegisterForm) {
  const { status } = await axios
    .post<RegisterDTO>('/api/account/register/', adaptRegisterForm(form))
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
