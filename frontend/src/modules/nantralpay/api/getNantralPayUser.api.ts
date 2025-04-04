import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

import { adaptNantralPayUser } from '../infra/nantralpayUser.adapter';
import { NantralPayUserDTO } from '../infra/nantralpayUser.dto';

export async function getNantralPayUserApi() {
  const { data } = await axios
    .get<NantralPayUserDTO>('/api/nantralpay/balance/current/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptNantralPayUser(data);
}
