import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function markNotificationAsUnseenApi(
  notificationId: number
): Promise<number> {
  const { status } = await axios
    .delete(`/api/notification/notification/${notificationId}/seen/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
