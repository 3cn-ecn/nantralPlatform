import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function removeEmailApi(emailUuid: string, user: number) {
  const { status } = await axios
    .delete(`/api/account/email/${emailUuid}/`, { params: { user } })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
