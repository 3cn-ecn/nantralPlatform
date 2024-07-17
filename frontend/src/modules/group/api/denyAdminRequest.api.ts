import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function denyAdminRequestApi(
  slug: string,
  adminRequestId: number,
) {
  const { status } = await axios
    .post(`/api/group/admin_request/${slug}/deny/`, { id: adminRequestId })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
