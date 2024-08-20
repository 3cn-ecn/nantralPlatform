import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function acceptAdminRequestApi(adminRequestId: number) {
  const { status } = await axios
    .post(`/api/group/membership/${adminRequestId}/accept_request/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
