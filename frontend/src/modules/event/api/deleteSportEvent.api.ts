import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export interface DeleteSportEventApiVariables {
  id: number;
  /** only delete this occurrence, and not the following ones */
  single?: boolean;
}

export async function deleteSportEventApi({
  id,
  single = false,
}: DeleteSportEventApiVariables) {
  const { status } = await axios
    .delete(`/api/event/sport/${id}/`, { params: single ? { single } : {} })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
