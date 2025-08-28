import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function removeEmailApi(emailUuid: string) {
  const { status } = await axios
    .delete(`/api/account/email/${emailUuid}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
