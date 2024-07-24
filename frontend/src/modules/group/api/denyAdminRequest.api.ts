import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function denyAdminRequestApi(adminRequestId: number) {
  const { status } = await axios
    .post(`/api/group/membership/${adminRequestId}/deny_request/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
