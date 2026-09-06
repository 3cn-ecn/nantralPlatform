import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function unregisterAsSportNonParticipantApi(id: number) {
  const { status } = await axios
    .delete(`/api/event/sport/${id}/not_participate/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
