import axios, { AxiosResponse } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { RegisterForm } from '../account.type';
import {
  adaptRegisterCreatedDTO,
  adaptRegisterForm,
} from '../infra/account.adapter';
import { RegisterCreatedDTO, RegisterDTO } from '../infra/account.dto';

export async function registerApi(form: RegisterForm) {
  const { data } = await axios
    .post<
      RegisterDTO,
      AxiosResponse<RegisterCreatedDTO>
    >('/api/account/register/', adaptRegisterForm(form))
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptRegisterCreatedDTO(data);
}
