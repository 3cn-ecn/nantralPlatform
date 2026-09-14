import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function unregisterAsSportParticipantApi(id: number) {
  const { status } = await axios
    .delete(`/api/event/sport/${id}/participate/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
