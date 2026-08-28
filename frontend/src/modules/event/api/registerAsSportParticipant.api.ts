import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function registerAsSportParticipantApi(id: number) {
  const { status } = await axios
    .post(`/api/event/sport/${id}/participate/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
