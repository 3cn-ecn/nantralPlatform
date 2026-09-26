import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function registerAsSportNonParticipantApi(id: number) {
  const { status } = await axios
    .post(`/api/event/sport/${id}/not_participate/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
