import axios from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

import { adaptUser } from '../infra/user.adapter';
import { UserDTO } from '../infra/user.dto';
import { User } from '../user.types';

interface GetUserDetailsApiParams {
  id: number;
}

export async function getUserDetailsApi({
  id,
}: GetUserDetailsApiParams): Promise<User> {
  const { data } = await axios
    .get<UserDTO>(`/api/account/user/${id}/`)
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return adaptUser(data);
}
