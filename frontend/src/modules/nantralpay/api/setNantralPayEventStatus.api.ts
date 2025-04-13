import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function enableNantralPayEventApi(eventId: number) {
  const { status } = await axios
    .post(`/api/nantralpay/event/${eventId}/enable/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}

export async function disableNantralPayEventApi(eventId: number) {
  const { status } = await axios
    .post(`/api/nantralpay/event/${eventId}/disable/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
