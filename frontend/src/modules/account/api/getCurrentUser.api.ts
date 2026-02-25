import axios, { GenericAbortSignal } from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

import { adaptUser } from '../infra/user.adapter';
import { UserDTO } from '../infra/user.dto';
import { User } from '../user.types';

interface GetCurrentUserApiParams {
  signal?: GenericAbortSignal;
}

export async function getCurrentUserApi({
  signal,
}: GetCurrentUserApiParams): Promise<User> {
  const { data } = await axios
    .get<UserDTO>('/api/account/user/me/', {
      signal,
    })
    .catch((error) => {
      throw adaptApiErrors(error);
    });

  return adaptUser(data);
}
