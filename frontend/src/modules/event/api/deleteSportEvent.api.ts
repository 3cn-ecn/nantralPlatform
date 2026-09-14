import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function deleteSportEventApi(id: number) {
  const { status } = await axios
    .delete(`/api/event/sport/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
