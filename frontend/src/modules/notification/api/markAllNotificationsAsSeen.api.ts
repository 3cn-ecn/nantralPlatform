import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function markAllNotificationsAsSeenApi(): Promise<number> {
  const { status } = await axios
    .post('/api/notification/notification/all_seen/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
