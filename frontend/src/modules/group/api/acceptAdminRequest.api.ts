import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function acceptAdminRequestApi(
  slug: string,
  adminRequestId: number,
) {
  const { status } = await axios
    .post(`/api/group/admin_request/${slug}/accept/`, { id: adminRequestId })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
