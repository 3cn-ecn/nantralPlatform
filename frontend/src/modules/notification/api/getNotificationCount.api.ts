import axios, { GenericAbortSignal } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export interface NotificationCountQueryParams {
  subscribed?: boolean | null;
  seen?: boolean | null;
}

export async function getNotificationCountApi(
  filters: NotificationCountQueryParams = {},
  signal?: GenericAbortSignal,
) {
  const { data } = await axios
    .get<number>('/api/notification/notification/count/', {
      params: filters,
      signal: signal,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return data;
}
