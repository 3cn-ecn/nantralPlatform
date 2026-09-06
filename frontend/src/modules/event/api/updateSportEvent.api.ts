import axios from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { convertSportEventForm } from '../infra/sportevent.converter';
import { SportEventFormDTO } from '../infra/sportevent.dto';
import { SportEventForm } from '../sportevent.type';

export interface UpdateSportEventApiVariables {
  id: number;
  data: SportEventForm;
}

export async function updateSportEventApi({
  id,
  data,
}: UpdateSportEventApiVariables) {
  await axios
    .put<SportEventFormDTO>(
      `/api/event/sport/${id}/`,
      convertSportEventForm(data),
    )
    .catch((err: ApiFormErrorDTO<SportEventFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
}
