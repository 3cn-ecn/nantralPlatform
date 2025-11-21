import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function deleteEventApi(id: number) {
  const { status } = await axios
    .delete(`/api/event/event/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
